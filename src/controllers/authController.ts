import { Request, Response } from "express";
import { UserTy } from "@/types/UserTy";
import { ERRORS } from "../helper/Errors";
import {
  errorResponse,
  successResponse,
  signToken,
  hashPassword,
  comparePassword,
  decodedJWT,
  jwtGenerate,
  jwtRefreshTokenGenerate,
} from "../helper/utils";
import onSendVerifyToEmail from "../helper/sendMail";
let validator = require("validator");
import * as test from "../persistence/mysql/User";
import * as log from "../persistence/mysql/Log";

export const login = async (req: Request, res: Response) => {
  try {
    const { user_email, user_password }: UserTy = req.body;

    const userData = await test.getUserByEmail(user_email);

    const isComparePassword = await comparePassword(user_password, userData.user_password);

    if (!isComparePassword) {
      return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, ERRORS.INCORRECT_EMAIL_OR_PASSWORD));
    }

    if (!userData.is_verify) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_IS_NOT_VERIFY));
    }
    const access_token = jwtGenerate(userData);
    const refresh_token = jwtRefreshTokenGenerate(userData);

    await log.createLog(userData.id, "LOGIN");

    res.send(
      successResponse({
        access_token: access_token,
        refresh_token: refresh_token,
      })
    );
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { user_email, user_password, user_confirm_password, user_displayname, user_tel }: UserTy = req.body;

    let users = await test.getUsers();

    const existEmail = users.find((v) => v.user_email === user_email);
    if (existEmail) return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_ALREADY_EXISTS));

    const passwordHash = await hashPassword(user_password);
    const tokenForVerify = signToken({ user_email });
    await test.createUser({ ...req.body, user_password_hash: passwordHash });
    await test.updateStatusVerify(false, user_email);
    // ส่ง email ไปหา user แต่ตอนนี้ถอด email , password ของ google ออกไปก่อน
    // await onSendVerifyToEmail(user_email, tokenForVerify);

    res.json(
      successResponse({
        description: "Register success. Please check your email for verify.",
        token_for_verify: tokenForVerify,
      })
    );
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const activeUser = async (req: Request, res: Response) => {
  try {
    const code = req.params.code;
    if (!code) {
      return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, ERRORS.CANT_VERIFY_ACCOUNT));
    }

    const { user_email } = await decodedJWT(code);

    let userData = await test.getUserByEmail(user_email);

    if (userData.is_verify) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_IS_VERIFY));
    }

    await test.updateStatusVerify(true, user_email);
    await log.createLog(userData.id, "USER IS VERIFIED");

    res.json(
      successResponse({
        userId: userData.id,
      })
    );
  } catch (error) {
    return res.json(
      errorResponse(404, ERRORS.TYPE.SERVER_ERROR, "Your verification link may have expired. Please click on resend for verify your Email.")
    );
  }
};

export const resendVerify = async (req: Request, res: Response) => {
  try {
    const { user_email }: UserTy = req.body;
    if (!user_email) {
      return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, ERRORS.INCORRECT_EMAIL_OR_PASSWORD));
    }

    if (!validator.isEmail(user_email)) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_INVALID));
    }
    const user = await test.getUserByEmail(user_email);

    if (!user) {
      return res.json(
        errorResponse(404, ERRORS.TYPE.BAD_REQUEST, "We were unable to find a user with that email. Make sure your Email is correct!")
      );
    }

    if (user.is_verify) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, "This email has been verify."));
    }
    const tokenForVerify = signToken({ user_email });

    await log.createLog(user.id, "USER IS RESEND VERIFY");
    await onSendVerifyToEmail(user_email, tokenForVerify);

    res.json(
      successResponse({
        description: "Register success. Please check your email for verify.",
        token: tokenForVerify,
      })
    );
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const userProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserTy;

    const result = await test.getUserByEmail(user.user_email);

    res.json(successResponse(result));
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { user_password, user_confirm_password, current_password } = req.body;

    const { id, user_email } = req.user as UserTy;

    const user = await test.getUserByEmail(user_email);

    const isComparePassword = await comparePassword(current_password, user.user_password);

    if (!isComparePassword) {
      return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, "Current password is not correct"));
    }

    const passwordHash = await hashPassword(user_password);
    await test.updatePassword(passwordHash, id);
    await log.createLog(id, "USER CHANGE PASSWORD");

    res.json(
      successResponse({
        userId: id,
      })
    );
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { user_email }: UserTy = req.body;

    if (!user_email) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.INCORRECT_EMAIL));
    }

    if (!validator.isEmail(user_email)) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_INVALID));
    }
    const user = await test.getUserByEmail(user_email);
    const tokenForReset = signToken({ user_email });
    await test.updateResetPasswordToken(tokenForReset, user.user_email);
    await log.createLog(user.id, "USER REQUEST RESET PASSWORD");
    res.json(
      successResponse({
        desciption: "We're send link for reset password. Plesase check your email",
        token_for_reset: tokenForReset,
      })
    );
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const changePasswordWithCode = async (req: Request, res: Response) => {
  try {
    const code = req.params.code;

    const { user_email } = await decodedJWT(code);

    let user = await test.getUserByEmail(user_email);

    if (!user.reset_password_token) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.LINK_HAS_BEEN_DESTROYED));
    }

    await log.createLog(user.id, "USER CHANGE PASSWORD WITH CODE");
    await test.removeResetPasswordToken(user_email);
    res.json(
      successResponse({
        user_email: user_email,
      })
    );
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const changeProfile = async (req: Request, res: Response) => {
  try {
    const user = req.body as UserTy;
    const { id } = req.user as UserTy;

    await test.updateProfile(id, user);
    await log.createLog(id, "USER UPDATE PROFILE");
    res.json(
      successResponse({
        userId: id,
      })
    );
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const userLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as UserTy;
    const result = await test.getUserLog(id);
    res.json(successResponse(result));
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { user_email } = req.user as UserTy;

    const user = await test.getUserByEmail(user_email);

    const access_token = jwtGenerate(user);

    res.send(
      successResponse({
        access_token: access_token,
      })
    );
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};
