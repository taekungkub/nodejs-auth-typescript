import { Request, Response } from "express";
import { UserTy } from "../Types/User";
import {
  errorResponse,
  successResponse,
  checkStrongPassword,
  getTokenBearer,
  signToken,
  hashPassword,
  comparePassword,
  decodedJWT,
} from "../config/utils";
import { ERRORS } from "../config/Errors";
import UserModel from "../models/UserModel";
let validator = require("validator");
import test from "../persistence/mysql/User";

export const login = async (req: Request, res: Response) => {
  try {
    const { user_email, user_password }: UserTy = req.body;

    if (!user_email || !user_password) {
      return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, ERRORS.INCORRECT_EMAIL_OR_PASSWORD));
    }

    if (!validator.isEmail(user_email)) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_INVALID));
    }

    // const userData = await UserModel.findOne({ email: user_email });
    const userData: UserTy = (await test.getUser(user_email)) as UserTy;
    if (!userData) {
      return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, ERRORS.INCORRECT_EMAIL_OR_PASSWORD));
    }
    const isPassword = await comparePassword(user_password, userData.user_password);
    if (!isPassword) {
      return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, ERRORS.INCORRECT_EMAIL_OR_PASSWORD));
    }

    if (!userData.is_verify) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, "This email not verify. Please check your email for verify."));
    }

    const token = signToken(userData);
    res.json(successResponse({ token }));
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { user_email, user_password, user_confirm_password, user_displayname, user_tel }: UserTy = req.body;

    if (!user_email || !user_password) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.PASSWORD_NOT_MATCH));
    }

    if (!validator.isEmail(user_email)) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_INVALID));
    }

    if (user_password != user_confirm_password) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.PASSWORD_NOT_MATCH));
    }
    if (!checkStrongPassword(user_password)) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.PASSWORD_NOT_STRONG));
    }
    const passwordHash = await hashPassword(user_password);

    // UserModel.create({ displayname: user_displayname, email: user_email, password: passwordHash }, function (err: Error, result: String) {
    //   if (err) throw err;
    //   res.json(successResponse({ result }));
    // });

    let userList: Array<string | number> = (await test.getUsers()) as Array<string | number>;
    const existEmail = userList.find((v: any) => v.user_email === user_email);
    if (existEmail) return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_ALREADY_EXISTS));

    const result = await test.createUser({ ...req.body, user_password_hash: passwordHash });
    if (result) {
      res.json(successResponse("Create user success."));
    }
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { user_email, user_password, user_confirm_password, user_displayname, user_tel }: UserTy = req.body;

    if (!user_email || !user_password) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.PASSWORD_NOT_MATCH));
    }

    if (!validator.isEmail(user_email)) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_INVALID));
    }

    if (user_password != user_confirm_password) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.PASSWORD_NOT_MATCH));
    }
    if (!checkStrongPassword(user_password)) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.PASSWORD_NOT_STRONG));
    }
    const passwordHash = await hashPassword(user_password);

    let userList: Array<string | number> = (await test.getUsers()) as Array<string | number>;
    const existEmail = userList.find((v: any) => v.user_email === user_email);
    if (existEmail) return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_ALREADY_EXISTS));

    const tokenForVerify = signToken({ user_email });
    const result = await test.createUser({ ...req.body, user_password_hash: passwordHash });
    const result2 = await test.updateStatusVerify(false, user_email);

    //send email with token
    if (result) {
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

    let userData: UserTy = (await test.getUser(user_email)) as UserTy;

    if (!userData) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, "We were unable to find a user for this verification. Please SignUp!"));
    } else if (userData.is_verify) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, "This email has been verify."));
    }

    const result = await test.updateStatusVerify(true, user_email);

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
  const { user_email }: UserTy = req.body;
  if (!user_email) {
    return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, ERRORS.INCORRECT_EMAIL_OR_PASSWORD));
  }

  if (!validator.isEmail(user_email)) {
    return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_INVALID));
  }
  const userData: UserTy = (await test.getUser(user_email)) as UserTy;

  if (!userData) {
    return res.json(
      errorResponse(404, ERRORS.TYPE.BAD_REQUEST, "We were unable to find a user with that email. Make sure your Email is correct!")
    );
  } else if (userData.is_verify) {
    return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, "This email has been verify."));
  }

  //send email with token
  const tokenForVerify = signToken({ user_email });
  res.json(
    successResponse({
      description: "Register success. Please check your email for verify.",
      token: tokenForVerify,
    })
  );
};

export const userProfile = async (req: Request, res: Response) => {
  try {
    const token = getTokenBearer(req);

    const decodeToken: any = await decodedJWT(token);
    // const userData = await UserModel.findOne({ email: email });
    res.json(successResponse(decodeToken));
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { user_password, user_confirm_password }: UserTy = req.body;

    if (!user_password || !user_confirm_password) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.PASSWORD_NOT_MATCH));
    }

    if (user_password != user_confirm_password) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.PASSWORD_NOT_MATCH));
    }
    if (!checkStrongPassword(user_password)) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.PASSWORD_NOT_STRONG));
    }

    const token = getTokenBearer(req);
    const { id }: any = await decodedJWT(token);
    const passwordHash: any = await hashPassword(user_password);
    // const userData = await UserModel.findByIdAndUpdate({ _id: _id }, { password: passwordHash });
    const result = await test.updatePassword(passwordHash, id);
    res.json(successResponse("Change password success"));
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
    const tokenForReset = signToken({ user_email });
    const result = await test.updateResetPasswordToken(tokenForReset, user_email);
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

    const { user_email }: any = await decodedJWT(code);

    if (!user_password || !user_confirm_password) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.PASSWORD_NOT_MATCH));
    }

    if (user_password != user_confirm_password) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.PASSWORD_NOT_MATCH));
    }

    if (!checkStrongPassword(user_password)) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.PASSWORD_NOT_STRONG));
    }

    let userData: UserTy = (await test.getUser(user_email)) as UserTy;

    if (!userData.reset_password_token) {
      return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, "This link has been destroyed."));
    }

    const result = await test.removeResetPasswordToken(user_email);
    res.json(successResponse("Change password success"));
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};
