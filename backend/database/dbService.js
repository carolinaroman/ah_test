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
    /**
     * 1. Filter providers by state.
     */
    console.log(df.columns);
    if (filters.state) {
      df = df.query(df["state licensed"].str.includes(filters.state));
    }
    /**
     * 2. Filter providers by payment method.
     */
    if (filters["payment method"] && filters["payment method"] !== "Self Pay") {
      df = df.query(
        df["insurance accepted"].str.includes(filters["payment method"]),
      );
    }

    return df;
  };

  /**
   * @private
   * Applies scoring based on matched filters from the criteria
   *
   * @param columnName
   * @param filters - json request from client
   * @param df - providers loaded in a Danfo dataframe
   * @param {string[]} filtersToCheck - Array of filter keys to check against criteria
   * @param {number} weight - The weight to add to matchScore when filter matches
   *
   * @returns {DataFrame} The modified dataframe with updated matchScores
   */
  _applyFilters = (columnName, filters, df, filtersToCheck, weight) => {
    for (const filter of filtersToCheck) {
      if (filters[filter]) {
        df[columnName].str.includes(filters[filter]);

        // This means if a match was found
        if (df.shape[0] !== 0) {
          df.addColumn(
            "matchScore",
            df["matchScore"].values.map((score) => score + weight),
          );
        } else {
          console.log("no result");
        }
      }
    }

    return df;
  };

  /**
   * Our matching function
   *
   * @param criteria
   * @return {Promise<object|void>}
   */
  async getMatches(criteria) {
    if (!this.df) {
      await this.initialize();
    }

    let filtered = this.df;

    /**
     * CRITICAL MATCH FACTORS
     */
    filtered = this._applyCriticalFilters(criteria, filtered);

    console.log(filtered);
    /**
     * Now we use our defined weights
     */
    const allFilters = [
      // {
      //   columnName: "areas of specialization",
      //   filters: concernsMapping, // Direct array from constants.js
      //   weights: this.weights.essential,
      // },
      // {
      //   columnName: "areas of concern",
      //   filters: Object.values(concernsMapping).flat(), // Flatten all concerns arrays
      //   weights: this.weights.essential,
      // },
      {
        columnName: "Religious Background",
        filters: religion,
        weights: this.weights.significant,
      },
      // {
      //   columnName: "Ethnic Identity",
      //   filters: criteria["ethnicity preference"],
      //   weights: this.weights.significant,
      // },
      // {
      //   columnName: "Gender Identity",
      //   filters: criteria["gender preference"],
      //   weights: this.weights.significant,
      // },
      // {
      //   columnName: "treatment modality",
      //   filters: Object.values(therapyTypes).flat(), // Flatten all therapy types arrays
      //   weights: this.weights.flexible,
      // },
    ];

    let currentFiltered = filtered;
    for (const filter of allFilters) {
      currentFiltered = this._applyFilters(
        filter.columnName,
        criteria,
        currentFiltered,
        filter.filters,
        filter.weights,
      );
    }
    filtered = currentFiltered;

    //
    // significant.forEach((pref) => {
    //   if (
    //     criteria[pref.criterion] &&
    //     criteria[pref.criterion] !== "no preference"
    //   ) {
    //     const matches = filtered[pref.field].str.includes(
    //       criteria[pref.criterion],
    //     );
    //     filtered["matchScore"] = filtered["matchScore"].add(
    //       matches.mul(this.weights.significant),
    //     );
    //   }
    // });
    //
    // // TREATMENT MODALITIES SCORING

    if (filtered.shape[0] !== 0) {
      // Sort by matches score
      filtered = filtered.sortValues("matchScore", { ascending: false });

      // // Filter by minimum score if specified
      // const minScore = parseInt(process.env.MATCHER_MIN_SCORE ?? "0");
      // if (minScore > 0) {
      //   filtered = filtered.query(filtered["matchScore"].ge(minScore));
      // }

      // Limit results
      const maxResults = parseInt(process.env.MATCHER_MAX_RESULTS ?? "20");
      filtered = filtered.head(maxResults);
    }

    // This is what we will return to client
    return this._transformToNormalJson(dfd.toJSON(filtered, { format: "row" }));
  }
}

// Create a singleton instance
const providerMatcher = new ProviderMatcher();
export default providerMatcher;
