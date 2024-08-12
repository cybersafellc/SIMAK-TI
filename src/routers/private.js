import express from "express";
import kordinatorController from "../controllers/kordinator-controller.js";
import authMiddelware from "../middlewares/auth-middelware.js";
import mahasiswaController from "../controllers/mahasiswa-controller.js";
import pembimbingController from "../controllers/pembimbing-controller.js";
import pengajuan_kpController from "../controllers/kerja-praktek/pengajuan_kp-controller.js";
import seminarController from "../controllers/kerja-praktek/seminar-controller.js";

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
router.put(
  "/kp/set-jadwal",
  authMiddelware.kordinator,
  pengajuan_kpController.setJadwal
);
router.put(
  "/kp/set-judul-laporan",
  authMiddelware.pembimbing,
  pengajuan_kpController.setJudulLaporan
);

// seminar kp
router.post("/seminar/kp", authMiddelware.mahasiswa, seminarController.create);
router.put(
  "/seminar/kp/disetujui",
  authMiddelware.kordinator,
  seminarController.disetujui
);
router.get("/seminar/kp", authMiddelware.authAll, seminarController.get);
router.put(
  "/seminar/kp/penilaian",
  authMiddelware.kordinator,
  seminarController.penilaian
);

export default router;
