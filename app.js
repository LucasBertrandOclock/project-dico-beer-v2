import "dotenv/config";
import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

import { router as apiRouter } from "./app/routers/router.js";
import { bodySanitizer } from "./app/middlewares/bodySanitizer.middleware.js";
import mongoose from "mongoose";

const version = process.env.API_VERSION || 9000;

const app = express();

// Application security
// DDOS :
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// CORS:
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// Body parser:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Body Sanitizer:
app.use(bodySanitizer);

app.get("/", (req, res, next) => {
  res.json({
    hello: "Welcome to the DicoBeer REST API!",
  });
  next();
});

mongoose.connect(process.env.MONGO_URL);

app.use(`/api/v${version}`, apiRouter);

export default app;
