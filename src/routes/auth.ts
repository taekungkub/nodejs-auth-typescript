import { Router } from "express";
const router = Router();
import * as authController from "../controllers/authController";
import checkAuth from "../middleware/checkAuth";

//------------ Login Route ------------//
router.get("/profile", checkAuth, authController.userProfile);
router.post("/login", authController.login);
router.post("/create", authController.createUser);
router.get("/activation/:code?", authController.activeUser);
router.post("/changepassword", checkAuth, authController.changePassword);
router.post("/password/reset", authController.resetPassword);
router.post("/password/new/:code?", authController.changePasswordWithCode);
router.post("/register", authController.register);
router.post("/resend/verify", authController.resendVerify);

module.exports = router;
