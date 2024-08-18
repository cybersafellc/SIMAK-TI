import express from "express";
import pembimbingController from "../controllers/pembimbing-controller.js";
import fileController from "../controllers/file-controller.js";
import mahasiswaController from "../controllers/mahasiswa-controller.js";
import kordinatorController from "../controllers/kordinator-controller.js";

const router = express.Router();
//pembimbing
router.get("/pembimbing", pembimbingController.getAllPublic);
router.use("/files", express.static("public/file"));
router.get("/files", fileController.get);
router.get("/mahasiswa/count", mahasiswaController.count);
router.get("/pembimbing/count", pembimbingController.count);
router.get("/files/count", fileController.count);
router.get("/kordinators/count", kordinatorController.count);
export default router;
