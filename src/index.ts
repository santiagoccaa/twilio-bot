import "dotenv/config";

import express, { type Express } from "express";
import mainRoutes from "./routes";

const port = process.env.PORT || 7070;

const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(mainRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running PORT ${port}`);
});
