import { Router } from "express";

import formSchema from "./requestSchema.js";
import providerMatcher from "../database/dbService.js";
import { sendApiResponse } from "../utils.js";

const router = Router();

/**
 * @description
 * Handles POST requests for provider matching:
 * 1. Validates the incoming request body against the form schema
 * 2. If validation passes, finds matching providers using the providerMatcher service
 * 3. Sends appropriate response with either matches or validation errors
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 *
 * @returns {Promise<Response>} - Returns a Promise resolving to a JSON payload:
 *   - On success (200): Array of matched providers
 *   - On error (400): Validation error details
 *
 * @throws {Error} Will send 400 response if validation fails
 */
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
