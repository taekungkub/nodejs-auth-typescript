import { Router } from "express";
const router = Router();
import * as authController from "../controllers/authController";
import checkAuth from "../middleware/checkAuth";

//------------ Login Route ------------//
router.get("/", checkAuth, authController.userProfile);
router.post("/login", authController.login);
router.post("/create", authController.createUser);
router.get("/activation/:code?", authController.activeUser);
router.post("/changepassword", authController.changePassword);
router.post("/password/reset", authController.resetPassword);
router.post("/password/new/:code?", authController.changePasswordWithCode);

module.exports = router;
