import express from "express";

import authController from "../controllers/auth.controller.js";

import cw from "../middlewares/controllerWrapper.middleware.js";

const router = express.Router();

router.post("/auth/register", cw(authController.signupUser));
router.post("/auth/login", cw(authController.loginUser));
router.post("/auth/refreshToken", cw(authController.refreshToken));

export default router;
