import "dotenv/config";
import cors from "cors";

import express, { type Express } from "express";
import mainRoutes from "./routes";

const port = process.env.PORT || 7070;

const app: Express = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["POST"],
    exposedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(mainRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running PORT ${port}`);
});
