import { Router } from "express";

import matches_routes from "./matches/matches.js";
import provider_routes from "./providers/providers.js";
import { validateApiKey } from "./apiAuth.js";

const router = Router();

/**
 * Endpoint to match patients to providers
 */
router.use("/matches", validateApiKey, matches_routes);

/**
 * Endpoint to display providers info
 */
router.use("/providers", validateApiKey, provider_routes);

export default router;
