import express from "express";
import pembimbingController from "../controllers/pembimbing-controller.js";

const router = express.Router();
//pembimbing
router.get("/pembimbing", pembimbingController.getAllPublic);
export default router;
