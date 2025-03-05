import { Router } from "express";

import provider_routes from "./providers/providers.js";

const router = Router();

router.use("/providers", provider_routes);

export default router;
