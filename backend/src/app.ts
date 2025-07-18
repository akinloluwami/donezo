import "../src/load-env";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth-routes";
import errorHandler from "./middleware/error-handler";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use(errorHandler);

export default app;
