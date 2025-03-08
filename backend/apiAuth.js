import { sendApiResponse } from "./utils.js";

const AUTH_NOT_VALID = "Authentication is not valid";

/**
 * Validates API key in calls. For now, API calls from our app
 * will have to provide a constant value we will store in our env vars
 *
 * @param req
 * @param res
 * @param next
 */
export const validateApiKey = async (req, res, next) => {
  let api_key = req.header("x-api-key");

  if (!api_key) {
    // Log and reject if the API key is missing
    console.error("API call with missing API key");

    return sendApiResponse(res, 403, AUTH_NOT_VALID);
  }

  if (api_key === process.env.ANISE_API_KEY) {
    next();
  } else {
    //Reject request if API key doesn't match
    console.error("API call with wrong credentials");

    return sendApiResponse(res, 403, AUTH_NOT_VALID);
  }
};
