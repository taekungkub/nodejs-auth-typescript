import { Router } from "express";
const router = Router();
import * as authController from "../controllers/authController";
import checkRefreshToken from "../middleware/checkRefreshToken";
import { checkAuth } from "../middleware/passport";

//------------ auth route ------------//

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.get("/auth/activation/:code?", authController.activeUser);
router.post("/auth/changepassword", checkAuth, authController.changePassword);
router.post("/auth/password/reset", authController.resetPassword);
router.post("/auth/password/new/:code?", authController.changePasswordWithCode);
router.post("/auth/resend/verify", authController.resendVerify);
router.post("/auth/refresh-token", checkRefreshToken, authController.refreshToken);

router.get("/auth/profile", checkAuth, authController.userProfile);
router.put("/auth/changeprofile", checkAuth, authController.changeProfile);
router.get("/auth/profile/log", checkAuth, authController.userLog);

export default router;
