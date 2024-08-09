import express from "express";
import kordinatorController from "../controllers/kordinator-controller.js";
import authMiddelware from "../middlewares/auth-middelware.js";
import mahasiswaController from "../controllers/mahasiswa-controller.js";
import pembimbingController from "../controllers/pembimbing-controller.js";
import pengajuan_kpController from "../controllers/kerja-praktek/pengajuan_kp-controller.js";

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

// kp
router.post("/kp", authMiddelware.mahasiswa, pengajuan_kpController.create);
router.get("/kp", authMiddelware.authAll, pengajuan_kpController.get);
router.put(
  "/kp/diterima",
  authMiddelware.kordinator,
  pengajuan_kpController.diterima
);
router.put(
  "/kp/ditolak",
  authMiddelware.kordinator,
  pengajuan_kpController.ditolak
);
router.put(
  "/kp/revisi",
  authMiddelware.mahasiswa,
  pengajuan_kpController.revisi
);

export default router;
