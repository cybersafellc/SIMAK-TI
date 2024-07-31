import express from "express";
import kordinatorController from "../controllers/kordinator-controller.js";
import authMiddelware from "../middlewares/auth-middelware.js";
import mahasiswaController from "../controllers/mahasiswa-controller.js";

const router = express.Router();
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
export default router;
