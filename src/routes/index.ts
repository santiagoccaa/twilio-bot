import callRouters from "../services/twilio/routes";
import aIRouters from "../services/openAi/routes";

import { Router } from "express";

const router = Router();

router.use("/twilio", callRouters);
router.use("/open-ai", aIRouters);

export default router;
