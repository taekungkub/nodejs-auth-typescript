import { Request, Response } from "express";
import { ChangepasswordSchemaBody, LoginSchemaBody, RegisterSchemaBody, UserTy } from "../Types/UserTy";
import { errorResponse, successResponse, getTokenBearer, signToken, hashPassword, comparePassword, decodedJWT } from "../config/utils";
import { ERRORS } from "../config/Errors";
let validator = require("validator");
import test from "../persistence/mysql/User";
import onSendVerifyToEmail from "../config/sendMail";
import * as log from "../persistence/mysql/Log";

export const login = async (req: Request, res: Response) => {
  try {
    const { user_email, user_password }: UserTy = req.body;

    const { error }: any = LoginSchemaBody.validate(req.body);

    if (error) {
      return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, error.message));
    }

    const userData: UserTy = (await test.getUserByEmail(user_email)) as UserTy;
    if (!userData) {
      return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, ERRORS.INCORRECT_EMAIL_OR_PASSWORD));
    }
    const isPassword = await comparePassword(user_password, userData.user_password);
    if (!isPassword) {
      return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, ERRORS.INCORRECT_EMAIL_OR_PASSWORD));
    }

    if (!userData.is_verify) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_IS_NOT_VERIFY));
    }
    const token = signToken(userData);

    await log.createLog(userData.id, "LOGIN");

    res.send(successResponse({ token }));
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { user_email, user_password, user_confirm_password, user_displayname, user_tel }: UserTy = req.body;

    const { error } = RegisterSchemaBody.validate(req.body);
    if (error) {
      return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, error.message));
    }
    let userList = (await test.getUsers()) as Array<any>;

    const existEmail = userList.find((v: UserTy) => v.user_email === user_email);
    if (existEmail) return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_ALREADY_EXISTS));

    const passwordHash = await hashPassword(user_password);
    const tokenForVerify = signToken({ user_email });
    const result = await test.createUser({ ...req.body, user_password_hash: passwordHash });
    const result2 = await test.updateStatusVerify(false, user_email);

    //send email with token

    if (result) {
      onSendVerifyToEmail(user_email, tokenForVerify);

      res.json(
        successResponse({
          description: "Register success. Please check your email for verify.",
          token: tokenForVerify,
        })
      );
    }
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

    const { user_email }: any = await decodedJWT(code);

    let userData: UserTy = (await test.getUserByEmail(user_email)) as UserTy;
    if (!userData) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.NOT_FOUND_USER));
    } else if (userData.is_verify) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_IS_VERIFY));
    }
    const result = await test.updateStatusVerify(true, user_email);
    await log.createLog(userData.id, "USER IS VERIFIED");

    res.json(
      successResponse({
        desciption: "Verify success.",
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
    const userData: UserTy = await test.getUserByEmail(user_email);

    if (!userData) {
      return res.json(
        errorResponse(404, ERRORS.TYPE.BAD_REQUEST, "We were unable to find a user with that email. Make sure your Email is correct!")
      );
    }

    if (userData.is_verify) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, "This email has been verify."));
    }

    await log.createLog(userData.id, "USER IS RESEND VERIFY");

    const tokenForVerify = signToken({ user_email });

    onSendVerifyToEmail(user_email, tokenForVerify);

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
    const token = getTokenBearer(req);

    const decodeToken: any = await decodedJWT(token);
    const result = await test.getUserByEmail(decodeToken.user_email);
    res.json(successResponse(result));
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { user_password, user_confirm_password }: UserTy = req.body;

    const { error }: any = ChangepasswordSchemaBody.validate(req.body);

    if (error) {
      return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, error.message));
    }

    const token = getTokenBearer(req);
    const { id }: UserTy = (await decodedJWT(token)) as UserTy;
    await log.createLog(id, "USER CHANGE PASSWORD");

    const passwordHash: string = (await hashPassword(user_password)) as string;
    const result = await test.updatePassword(passwordHash, id);
    if (result) {
      res.json(successResponse("Change password success"));
    }
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
    const user: UserTy = await test.getUserByEmail(user_email);
    const tokenForReset = signToken({ user_email });

    await test.updateResetPasswordToken(tokenForReset, user.user_email);

    await log.createLog(user.id, "USER REQUEST RESET PASSWORD");
    res.json(
      successResponse({
        desciption: "We're send link for reset password. Plesase check your email",
        token: tokenForReset,
      })
    );
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const changePasswordWithCode = async (req: Request, res: Response) => {
  try {
    const code = req.params.code;
    const { user_password, user_confirm_password }: UserTy = req.body;

    if (!code) {
      return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, ERRORS.PASSWORD_RESET_LINK_INVALID));
    }

    const { user_email }: UserTy = (await decodedJWT(code)) as UserTy;

    const { error }: any = ChangepasswordSchemaBody.validate({ user_password, user_confirm_password });

    if (error) {
      return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, error.message));
    }

    let userData: UserTy = await test.getUserByEmail(user_email);

    if (!userData.reset_password_token) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.LINK_HAS_BEEN_DESTROYED));
    }

    await log.createLog(userData.id, "USER CHANGE PASSWORD WITH CODE");
    await test.removeResetPasswordToken(user_email);
    res.json(successResponse("Change password success"));
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const changeProfile = async (req: any, res: Response) => {
  try {
    const userData: UserTy = req.body;
    const token = getTokenBearer(req);
    const { id }: any = await decodedJWT(token);
    await test.updateProfile(id, userData);
    await log.createLog(id, "USER UPDATE PROFILE");
    res.json(successResponse("Change profile success"));
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const userLog = async (req: any, res: Response) => {
  try {
    const token = getTokenBearer(req);
    const { id }: any = await decodedJWT(token);
    const result = await test.getUserLog(id);
    if (result) {
      res.json(successResponse(result));
    }
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};
