import { Router } from "express";

import formSchema from "./requestSchema.js";
import providerMatcher from "../database/dbService.js";
import { sendApiResponse } from "../utils.js";

const router = Router();

export const postMatchesHandler = async (req, res) => {
  /**
   * 1. Validate request
   */
  const { error, value } = formSchema.validate(req.body);
  if (error) {
    console.error("Validation error:", error.details);

    return sendApiResponse(res, 400, error.details);
  }

  /**
   * 2. Use request to filter providers
   */
  const matches = await providerMatcher.getMatches(value);

  return sendApiResponse(res, 200, matches);
};

router.post("", postMatchesHandler);

export default router;
