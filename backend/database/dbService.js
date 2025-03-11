import dfd, { DataFrame } from "danfojs";

import { loadCSV } from "../client.js";
import { concernsMapping, religion, therapyTypes } from "shared";

/**
 * Let's create an interface to use Danfo instead of a proper database
 * backend. Danfo should be able to work with tabular data without having
 * to add the complexity of a whole database and an ORM
 *
 * We will use a weights system to prioritize some criteria over others
 *
 * - Non-optional: state (because licensing) and payment method
 * - 3/ESSENTIAL: clinical needs (our patient knows what problem they have and this
 *      is why they are connecting with us)
 * - 2/SIGNIFICANT: personal significant (a very important part of the therapeutic
 *      relationship is to feel understood by the therapist. Religion,
 *      ethnicity and gender have the same weight)
 * - 1/FLEXIBLE: treatment flexible (patients are not necessarily experts in this
 *      domain, and therapists often use multiple modes to trat patients)
 */
export class ProviderMatcher {
  constructor() {
    this.df = null;

    // These are env variables so we don't have to redeploy if we
    // decide to change priorities while matching
    this.weights = {
      essential: parseInt(process.env.MATCHER_WEIGHT_CLINICAL_NEEDS ?? "3"),
      significant: parseInt(process.env.MATCHER_WEIGHT_PREFERENCES ?? "3"),
      flexible: parseInt(process.env.MATCHER_WEIGHT_MODALITIES ?? "3"),
    };
  }

  /**
   * This would be our init database, when we gain access to the data
   *
   * @return {Promise<void>}
   */
  async initialize() {
    if (!this.df) {
      try {
        const data = await loadCSV("providers.csv", "providers");

        if (data.length === 0) {
          throw new Error("No data loaded from CSV");
        }

        this.df = new DataFrame(data);

        console.log(
          `Provider matcher initialized with ${this.df.shape[0]} records`,
        );
      } catch (error) {
        throw new Error(
          "Failed to initialize provider matcher: " + error.message,
        );
      }
    }
  }

  /**
   * @private
   * Converts dataframe result (where each attribute will have an array
   * of values) into a normal looking json for frontend display
   *
   * @param dfJson
   *
   * @return {Object}
   */
  _transformToNormalJson = (dfJson) => {
    const keys = Object.keys(dfJson);

    return dfJson[keys[0]].map((_, index) => {
      const obj = {};

      keys.forEach((key) => {
        obj[key] = dfJson[key][index];
      });

      return obj;
    });
  };

  /**
   * @private
   * This helper applies the critical and required filters.
   *  - State is a required filter: we cannot assign providers not
   *    licensed in our patient state
   *  - If payment method is not self, we will filter out providers
   *    who don't accept that payment method
   *
   * @param filters - json request from client
   * @param df - providers loaded in a Danfo dataframe
   *
   * @return {DataFrame}
   */
  _applyCriticalFilters = (filters, df) => {
    let tmpDf = df.copy();

    // 1. Filter providers by state.
    if (filters.state) {
      tmpDf = tmpDf.loc({
        rows: tmpDf["state licensed"].str.includes(filters.state),
      });
    }

    // 2. Filter providers by payment method.
    if (filters["payment method"] && filters["payment method"] !== "Self Pay") {
      tmpDf = tmpDf.loc({
        rows: tmpDf["insurance accepted"].str.includes(
          filters["payment method"],
        ),
      });
    }

    return tmpDf;
  };

  /**
   * @private
   * Applies scoring based on matched reqAttrName from the criteria
   *
   * @param dfColumnName - name of dataframe column to match
   * @param reqAttrValue - value of attribute in request
   * @param df - providers loaded in a Danfo dataframe
   * @param {number} weight - The weight to add to matchScore when filter matches
   *
   * @returns {DataFrame} The modified dataframe with updated matchScores
   */
  _applyFilters = (df, dfColumnName, reqAttrValue, weight) => {
    let filteredDf = df.copy();

    const matchFound = filteredDf[dfColumnName].str.includes(reqAttrValue);
    filteredDf = df.loc({ rows: matchFound });

    // This means if a match was found
    if (filteredDf.shape[0] !== 0) {
      // Update value for matchScore
      filteredDf.addColumn(
        "matchScore",
        filteredDf["matchScore"].values.map(
          (score) => parseInt(score) + parseInt(weight),
        ),
      );

      // Update the DataFrame with the filtered results
    } else {
      console.log("no result");
    }

    return filteredDf;
  };

  /**
   * Our matching function
   *
   * @param reqFilters
   * @return {Promise<object|void>}
   */
  async getMatches(reqFilters) {
    if (!this.df) {
      await this.initialize();
    }

    let filtered = this.df;

    const {
      state,
      "payment method": paymentMethod,
      ...otherFilters
    } = reqFilters;

    const criticalFilters = { state, "payment method": paymentMethod };

    /**
     * CRITICAL MATCH FACTORS
     */
    filtered = this._applyCriticalFilters(criticalFilters, filtered);

    /**
     * Now we use our defined weights
     */
    const allFilters = [
      // {
      //   dfColumnName: "areas of specialization",
      //   reqAttrName: concernsMapping, // Direct array from constants.js
      //   weights: this.weights.essential,
      // },
      // {
      //   dfColumnName: "areas of concern",
      //   reqAttrName: Object.values(concernsMapping).flat(), // Flatten all concerns arrays
      //   weights: this.weights.essential,
      // },
      {
        dfColumnName: "religious background",
        reqAttrName: "religion",
        weights: this.weights.significant,
      },
      {
        dfColumnName: "ethnic identity",
        reqAttrName: "ethnic identity",
        weights: this.weights.significant,
      },
      {
        dfColumnName: "gender identity",
        reqAttrName: "gender",
        weights: this.weights.significant,
      },
      // {
      //   dfColumnName: "treatment modality",
      //   reqAttrName: Object.values(therapyTypes).flat(), // Flatten all therapy types arrays
      //   weights: this.weights.flexible,
      // },
    ];

    let currentFiltered = filtered;
    for (const filter of allFilters) {
      currentFiltered = this._applyFilters(
        currentFiltered,
        filter.dfColumnName,
        otherFilters[filter.reqAttrName],
        filter.weights,
      );
    }
    filtered = currentFiltered;

    if (filtered.shape[0] !== 0) {
      // Sort by matches score
      filtered = filtered.sortValues("matchScore", { ascending: false });

      // Filter by minimum score if specified
      const minScore = parseInt(process.env.MATCHER_MIN_SCORE ?? "0");
      if (minScore > 0) {
        filtered = filtered.query(filtered["matchScore"].ge(minScore));
      }

      // Limit results
      const maxResults = parseInt(process.env.MATCHER_MAX_RESULTS ?? "3");
      filtered = filtered.head(maxResults);
    }

    // This is what we will return to client
    return this._transformToNormalJson(dfd.toJSON(filtered, { format: "row" }));
  }
}

// Create a singleton instance
const providerMatcher = new ProviderMatcher();
export default providerMatcher;
