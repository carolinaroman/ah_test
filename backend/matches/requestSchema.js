import Joi from "joi";

import {
  concernsMapping,
  ethnicity,
  gender,
  insurances,
  languages,
  religion,
  therapyTypes,
} from "shared";

/**
 * Creates validation rules object where each key maps to a required boolean
 * @param {Object} sourceObject - The object whose keys will be used to create validation rules
 * @returns {Object} Object with Joi boolean validation rules for each key
 */
const createBooleanRules = (sourceObject) => {
  const rules = {};
  for (const key of Object.keys(sourceObject)) {
    rules[key] = Joi.boolean().required();
  }
  return rules;
};

export default Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  state: Joi.string().length(2).required(),

  ...createBooleanRules(concernsMapping),
  ...createBooleanRules(therapyTypes),

  // Using flat arrays directly to enforce values
  ethnicity: Joi.string()
    .valid(...ethnicity)
    .allow(""),
  gender: Joi.string()
    .lowercase() // First convert to lowercase
    .valid(...gender) // Then validate against allowed values
    .required(),
  language: Joi.string()
    .valid(...languages)
    .allow(""),
  religion: Joi.string()
    .valid(...religion)
    .required(),

  "payment method": Joi.string()
    .valid(...insurances)
    .required(),
});
