import { Router } from "express";

import { loadCSV } from "../client.js";
import { sendApiResponse } from "../utils.js";

const router = Router();

export const getProviderById = async (req, res) => {
  const allProviders = await loadCSV("providers.csv", "providers");

  return sendApiResponse(res, 200, allProviders);
};

router.get("/", getProviderById);

export default router;
