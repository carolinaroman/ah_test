import Joi from "joi";

export default Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  state: Joi.string().length(2).required(), // State abbreviation (2 letters)
  background: Joi.string().allow(""),
  "academic stress": Joi.boolean().required(),
  anxiety: Joi.boolean().required(),
  depression: Joi.boolean().required(),
  insomnia: Joi.boolean().required(),
  "racial identity issues": Joi.boolean().required(),
  "trauma related stress": Joi.boolean().required(),
  "work related stress": Joi.boolean().required(),
  gender: Joi.string().allow(""),
  ethnicity: Joi.string().allow(""),
  religion: Joi.string().allow(""),
  "cognitive behavioral therapy (cbt)": Joi.boolean().required(),
  "dialectical behavior therapy (dbt)": Joi.boolean().required(),
  "acceptance and commitment therapy (act)": Joi.boolean().required(),
  "eye movement desensitization and reprocessing (emdr)":
    Joi.boolean().required(),
  paymentMethod: Joi.string().required(),
  gender_preference: Joi.string().required(),
  ethnicity_preference: Joi.string().required(),
  religion_preference: Joi.string().required(),
});
