import callRouters from "../services/twilio/routes";
import aIRouters from "../services/openAi/routes";
import geminiRouters from "../services/gemini/routes";


import { Router } from "express";

const router = Router();

router.use("/twilio", callRouters);
router.use("/open-ai", aIRouters);
router.use("/gemini", geminiRouters);


export default router;
