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
  _applyStringFilters = (df, dfColumnName, reqAttrValue, weight) => {
    try {
      // Skip filtering if value is "no preference"
      if (reqAttrValue.toLowerCase() === "no preference") {
        console.log(`Skipping ${dfColumnName}: "no preference"`);
        return df;
      }
    } catch (error) {
      console.log(dfColumnName, error);
    }

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
   * Filters providers based on concerns and therapy types
   * @param {DataFrame} df - The providers dataframe
   * @param {string} columnName - Column name to match against
   * @param {Object} mappingObject - Either concernsMapping or therapyTypes
   * @param {Object} request - Request object with filters
   * @returns {DataFrame} Filtered dataframe with matching providers
   */
  applyComplexFilter = (df, columnName, mappingObject, request) => {
    // Extract all keys where value is true
    const selectedFilters = Object.entries(request)
      .filter(([key, value]) => value === true)
      .map(([key]) => key.replace(/^(concerns_|therapy_)/, ""));

    // These are the values actually in the mock data
    const valuesToMatch = selectedFilters.flatMap(
      (filter) => mappingObject[filter] || [],
    );

    // If no filters selected, return the original dataframe
    if (selectedFilters.length === 0) {
      return df;
    }

    // Create the matching mask
    const matches = df[columnName].apply((values) => {
      const providerValues = Array.isArray(values)
        ? values
        : values.split(",").map((v) => v.trim());

      return valuesToMatch.some((value) => providerValues.includes(value));
    });

    // Return filtered dataframe
    return df.loc({ rows: matches });
  };

  /**
   * Our matching function
   *
   * @param request
   * @return {Promise<object|void>}
   */
  async getMatches(request) {
    if (!this.df) {
      await this.initialize();
    }

    let filtered = this.df;

    const { state, "payment method": paymentMethod, ...otherFilters } = request;

    /**
     * CRITICAL MATCH FACTORS
     */
    const criticalFilters = { state, "payment method": paymentMethod };
    filtered = this._applyCriticalFilters(criticalFilters, filtered);

    /**
     * Complex filters, these are things like
     * {
     *   "ADHD & Autism": true,
     *   "Anxiety, Panic & Worry": false
     * }
     */
    filtered = this.applyComplexFilter(
      filtered,
      "areas of specialization",
      concernsMapping,
      request,
    );

    /**
     * These filters are things like {religion: "Christian"}
     */
    const stringFilters = [
      {
        dfColumnName: "religious background",
        reqAttrName: "religion",
        weights: this.weights.significant,
      },
      {
        dfColumnName: "ethnic identity",
        reqAttrName: "ethnicity",
        weights: this.weights.significant,
      },
      {
        dfColumnName: "gender identity",
        reqAttrName: "gender",
        weights: this.weights.significant,
      },
      {
        dfColumnName: "language",
        reqAttrName: "language",
        weights: this.weights.significant,
      },
    ];

    let currentFiltered = filtered;
    for (const filter of stringFilters) {
      currentFiltered = this._applyStringFilters(
        currentFiltered,
        filter.dfColumnName,
        otherFilters[filter.reqAttrName],
        filter.weights,
      );
    }
    filtered = currentFiltered;

    filtered = this.applyComplexFilter(
      filtered,
      "treatment modality",
      therapyTypes,
      request,
    );

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
