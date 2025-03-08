import { Router } from "express";

import provider_routes from "./providers/providers.js";
import { validateApiKey } from "./apiAuth.js";

const router = Router();

router.use("/providers", validateApiKey, provider_routes);

export default router;
