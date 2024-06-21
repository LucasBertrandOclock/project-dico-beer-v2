import { Router } from "express";

//Controllers
import listContoller from "../controllers/list.controller.js";

//Middlewares
import cw from "../middlewares/controllerWrapper.middleware.js";
import jwtAuthenticationMiddleware from "../middlewares/jwtAuthentication.middleware.js";
import { isLoggedIn } from "../middlewares/login.middleware.js";

const router = Router();

router.get(
  "/lists",
  jwtAuthenticationMiddleware,
  isLoggedIn,
  cw(listContoller.getAllLists)
);

router.get(
  "/lists/:id",
  jwtAuthenticationMiddleware,
  isLoggedIn,
  cw(listContoller.getListById)
);

router.post(
  "/lists",
  jwtAuthenticationMiddleware,
  isLoggedIn,
  cw(listContoller.createList)
);

router.delete(
  "/lists/:id",
  jwtAuthenticationMiddleware,
  isLoggedIn,
  cw(listContoller.deleteList)
);

router.put(
  "/lists/:id",
  jwtAuthenticationMiddleware,
  isLoggedIn,
  cw(listContoller.updateList)
);

export default router;
