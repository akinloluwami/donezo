import "../src/load-env";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth-routes";
import errorHandler from "./middleware/error-handler";
import cookieParser from "cookie-parser";
import collectionRoutes from "./routes/collection-routes";
import requireAuth from "./middleware/require-auth";
import taskRoutes from "./routes/task-routes";
import labelRoutes from "./routes/label-routes";
import helmet from "helmet";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/collections", requireAuth, collectionRoutes);
app.use("/tasks", requireAuth, taskRoutes);
app.use("/labels", requireAuth, labelRoutes);
app.use(errorHandler);

export default app;
