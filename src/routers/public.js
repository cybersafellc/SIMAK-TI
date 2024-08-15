import express from "express";
import pembimbingController from "../controllers/pembimbing-controller.js";
import fileController from "../controllers/file-controller.js";

const router = express.Router();
//pembimbing
router.get("/pembimbing", pembimbingController.getAllPublic);
router.use("/files", express.static("public/file"));
router.get("/files", fileController.get);
export default router;
