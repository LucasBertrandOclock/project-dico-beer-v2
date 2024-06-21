import express from "express";
import typeController from "../controllers/type.controller.js";

const router = express.Router();

router.get("/types", typeController.getAllTypes);
router.get("/types/:id", typeController.getTypeById);
router.post("/types", typeController.createType);
router.delete("/types/:id", typeController.deleteType);
router.put("/types/:id", typeController.updateType);

export default router;