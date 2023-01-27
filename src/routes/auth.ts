import { Router } from "express";
import passport from "passport";
const router = Router();
import * as authController from "../controllers/authController";
import checkRefreshToken from "../middleware/checkRefreshToken";
import { checkAuth } from "../middleware/passport";

//------------ Login Route ------------//

router.get("/profile", checkAuth, authController.userProfile);
router.post("/login", authController.login);
router.get("/activation/:code?", authController.activeUser);
router.post("/changepassword", checkAuth, authController.changePassword);
router.post("/password/reset", authController.resetPassword);
router.post("/password/new/:code?", authController.changePasswordWithCode);
router.post("/register", authController.register);
router.post("/resend/verify", authController.resendVerify);
router.put("/changeprofile", checkAuth, authController.changeProfile);
router.get("/profile/log", checkAuth, authController.userLog);
router.post("/refresh-token", checkRefreshToken, authController.refreshToken);

export default router;
