import callRouters from "../services/twilio/routes";
import chatRouters from "../services/gemini/routes";

import { Router } from "express";

const router = Router();

router.use("/twilio", callRouters);
router.use("/chat", chatRouters);

export default router;
