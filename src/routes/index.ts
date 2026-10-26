import callRouters from "../services/twilio/routes";

import { Router } from "express";

const router = Router();

router.use("/twilio", callRouters);

export default router;
