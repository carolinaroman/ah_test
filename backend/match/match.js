import { Router } from "express";

import formSchema from "./requestSchema.js";
import { loadCSV } from "../client.js";
import { sendApiResponse } from "../utils.js";

const router = Router();

export const postMatchHandler = async (req, res) => {
  /**
   * 1. Validate request
   */

  const { error, value } = formSchema.validate(req.body);
  if (error) {
    console.error("Validation error:", error.details);

    return sendApiResponse(res, 400, error.details);
  }

  console.log(value);
  // const allProviders = await loadCSV("providers.csv", "providers");

  return sendApiResponse(res, 200, "success");
};

router.post("", postMatchHandler);

export default router;
