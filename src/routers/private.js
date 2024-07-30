import express from "express";
import kordinatorController from "../controllers/kordinator-controller.js";
import authMiddelware from "../middlewares/auth-middelware.js";

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
export default router;
