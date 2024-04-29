import express from "express";
import helmet from "helmet";
import { registerRoutes } from "./utils/routeRegister";

const app = express();

app.disable("x-powered-by");
app.use(express.json());

app.use("/", registerRoutes());

export default app;
