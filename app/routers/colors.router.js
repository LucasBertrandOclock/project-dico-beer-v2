import express from "express";
import colorController from "../controllers/color.controller.js";

const router = express.Router();

router.get("/colors", colorController.getAllColors);
router.get("/colors/:id", colorController.getColorById);
router.post("/colors", colorController.createColor);
router.delete("/colors/:id", colorController.deleteColor);
router.put("/colors/:id", colorController.updateColor);

export default router;