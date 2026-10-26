import { Router } from "express";
import { gemini } from "./controller";

const router = Router();

router.post("/", gemini);

export default router;
