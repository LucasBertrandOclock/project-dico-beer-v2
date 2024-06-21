import express from "express";

import userController from "../controllers/user.controller.js";
import cw from "../middlewares/controllerWrapper.middleware.js";
import jwtAuthenticationMiddleware from "../middlewares/jwtAuthentication.middleware.js";
import { isLoggedIn, isAdmin } from "../middlewares/login.middleware.js";

const router = express.Router();

router.get(
  "/users",
  jwtAuthenticationMiddleware,
  isAdmin,
  cw(userController.getAllUsers)
);
router.get(
  "/user",
  jwtAuthenticationMiddleware,
  isLoggedIn,
  cw(userController.getUserById)
);
router.delete(
  "/users",
  jwtAuthenticationMiddleware,
  isLoggedIn,
  cw(userController.deleteUser)
);
router.put(
  "/users",
  jwtAuthenticationMiddleware,
  isLoggedIn,
  cw(userController.updateUser)
);
router.patch(
  "/users",
  jwtAuthenticationMiddleware,
  isLoggedIn,
  cw(userController.changePassword)
);

export default router;
