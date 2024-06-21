import express from "express";
import beerController from "../controllers/beer.controller.js";
import cw from "../middlewares/controllerWrapper.middleware.js";
import jwtAuthenticationMiddleware from "../middlewares/jwtAuthentication.middleware.js";
import { isAdmin } from "../middlewares/login.middleware.js";

const router = express.Router();

router.get("/beers", cw(beerController.getAllBeers));
router.get("/beers/:id", cw(beerController.getBeerById));
router.post("/beers", cw(beerController.createBeer));
router.delete(
  "/beers/:id",
  jwtAuthenticationMiddleware,
  isAdmin,
  cw(beerController.deleteBeer)
);
router.patch(
  "/beers/:id",
  jwtAuthenticationMiddleware,
  isAdmin,
  cw(beerController.updateBeer)
);

export default router;
