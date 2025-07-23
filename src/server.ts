// src/server.ts
import express from "express";
import './config/config';
import { logger } from "./middlewares/logger.middleware";
import errorMiddleware from "./middlewares/error.middleware";
import postRoute from "./routes/postRoutes";

const app = express();

// middleware
app.use(express.json());
app.use(logger);

// routes
app.use("/api/v1/posts", postRoute);

// error handler
app.use(errorMiddleware);

export default app;
