import express from "express";
import kordinatorController from "../controllers/kordinator-controller.js";
import authMiddelware from "../middlewares/auth-middelware.js";
import mahasiswaController from "../controllers/mahasiswa-controller.js";
import pembimbingController from "../controllers/pembimbing-controller.js";

const router = express.Router();
// kordinators
router.post("/kordinators", kordinatorController.create);
router.post("/kordinators/login", kordinatorController.login);
router.get(
  "/kordinators/token-verify",
  authMiddelware.kordinator,
  kordinatorController.tokenVerify
);
router.get(
  "/kordinators/profile",
  authMiddelware.kordinator,
  kordinatorController.profile
);
router.get(
  "/kordinators",
  authMiddelware.kordinator,
  kordinatorController.getAll
);
// mahasiswa
router.post("/mahasiswa", mahasiswaController.create);
router.post("/mahasiswa/login", mahasiswaController.login);
router.get(
  "/mahasiswa/token-verify",
  authMiddelware.mahasiswa,
  mahasiswaController.tokenVerify
);
router.get(
  "/mahasiswa/profile",
  authMiddelware.mahasiswa,
  mahasiswaController.profile
);
router.get("/mahasiswa", authMiddelware.kordinator, mahasiswaController.getAll);
// pembimbing
router.post(
  "/pembimbing",
  authMiddelware.kordinator,
  pembimbingController.create
);
router.post("/pembimbing/login", pembimbingController.login);
router.get(
  "/pembimbing/token-verify",
  authMiddelware.pembimbing,
  pembimbingController.tokenVerify
);
router.get(
  "/pembimbing/profile",
  authMiddelware.pembimbing,
  pembimbingController.profile
);
export default router;
