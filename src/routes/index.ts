import callRouters from "../services/twilio/routes";
import chatRouters from "../services/gemini/routes";
import dashboardRouters from "../services/dashboard/routes";

import { Router } from "express";

const router = Router();

router.use("/twilio", callRouters);
router.use("/chat", chatRouters);
router.use("/dashboard", dashboardRouters);

export default router;
