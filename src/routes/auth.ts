import { Router } from "express";
const router = Router();
import * as authController from "@/controllers/authController";
import checkRefreshToken from "@/middleware/checkRefreshToken";
import { checkAuth } from "@/middleware/passport";
import validateRequestSchema from "@/middleware/validateRequestSchema";
import { changepasswordSchema, changepasswordWithCodeSchema, loginSchema, registerSchema } from "@/validation/user.schema";

//------------ auth route ------------//

router.post("/auth/login", validateRequestSchema(loginSchema), authController.login);
router.post("/auth/register", validateRequestSchema(registerSchema), authController.register);
router.get("/auth/activation/:code?", authController.activeUser);
router.post("/auth/changepassword", validateRequestSchema(changepasswordSchema), checkAuth, authController.changePassword);
router.post("/auth/password/reset", authController.resetPassword);
router.post("/auth/password/new/:code?", validateRequestSchema(changepasswordWithCodeSchema), authController.changePasswordWithCode);
router.post("/auth/resend/verify", authController.resendVerify);
router.post("/auth/refresh-token", checkRefreshToken, authController.refreshToken);

router.get("/auth/profile", checkAuth, authController.userProfile);
router.put("/auth/changeprofile", checkAuth, authController.changeProfile);
router.get("/auth/profile/log", checkAuth, authController.userLog);

export default router;
