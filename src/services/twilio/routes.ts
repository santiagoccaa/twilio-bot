import { Router } from "express";
import { handleReceiveCall,handleProcessSpeech,getErrors } from "./controller";

const routes = Router();

routes.post("/call", handleReceiveCall);
routes.post("/process", handleProcessSpeech);
// routes.post("/comprar", handleProcessSpeech);

routes.post("/errors", getErrors);

export default routes;
