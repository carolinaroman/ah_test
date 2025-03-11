import Joi from "joi";

import {
  concernsMapping,
  gender,
  ethnicIdentities,
  languages,
  religion,
  therapyTypes,
  insurances,
} from "shared";

export default Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  state: Joi.string().length(2).required(),

  // Using object keys from concernsMapping
  ...Object.keys(concernsMapping).reduce((acc, key) => {
    acc[key] = Joi.boolean().required();
    return acc;
  }, {}),

  // Using object keys from therapyTypes
  ...Object.keys(therapyTypes).reduce((acc, key) => {
    acc[key] = Joi.boolean().required();
    return acc;
  }, {}),

  // Using flat arrays directly
  gender: Joi.string()
    .lowercase() // First convert to lowercase
    .valid("male", "female", "no preference") // Then validate against allowed values
    .required(),
  ethnicity: Joi.string()
    .valid(...ethnicIdentities)
    .allow(""),
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
