import { Router } from "express";
import { handleReciveCall } from "./controller";

const routes = Router();

routes.post("/call", handleReciveCall);

export default routes;
