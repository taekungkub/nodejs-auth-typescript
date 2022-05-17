import { Request, Response } from "express";
import { User } from "../config/types";
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
var validator = require("validator");

export const login = async (req: Request, res: Response) => {
  const { user_email, user_password }: User = req.body;

  if (!user_email || !user_password) {
    return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, ERRORS.INCORRECT_EMAIL_OR_PASSWORD));
  }

  if (!validator.isEmail(user_email)) {
    return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_INVALID));
  }

  const userData = await UserModel.findOne({ email: user_email });
  if (!userData) {
    return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, ERRORS.INCORRECT_EMAIL_OR_PASSWORD));
  }
  const isPassword = await comparePassword(user_password, userData.password);
  if (!isPassword) {
    return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, ERRORS.INCORRECT_EMAIL_OR_PASSWORD));
  }

  const token = signToken(userData);

  res.json(successResponse({ token }));
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { user_email, user_password, user_confirm_password, user_displayname, user_tel }: User = req.body;

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

    const existEmail = await UserModel.findOne({ email: user_email });

    if (existEmail) return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_ALREADY_EXISTS));

    const passwordHash = await hashPassword(user_password);

    UserModel.create({ displayname: user_displayname, email: user_email, password: passwordHash }, function (err: Error, result: String) {
      if (err) throw err;
      res.json(successResponse({ result }));
    });
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const activeUser = (req: Request, res: Response) => {
  const code = req.params.code;
  if (!code) {
    return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, ERRORS.CANT_VERIFY_ACCOUNT));
  }
  res.json(successResponse({}));
};

export const userProfile = async (req: Request, res: Response) => {
  const token = getTokenBearer(req);
  const { email }: any = await decodedJWT(token);
  const userData = await UserModel.findOne({ email: email });
  res.json(successResponse(userData));
};

export const changePassword = async (req: Request, res: Response) => {
  const { user_password, user_confirm_password }: User = req.body;

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
  const { _id }: any = await decodedJWT(token);
  const passwordHash = await hashPassword(user_password);
  const userData = await UserModel.findByIdAndUpdate({ _id: _id }, { password: passwordHash });
  res.json(successResponse("Change password success"));
};

export const resetPassword = (req: Request, res: Response) => {
  const { user_email }: User = req.body;

  if (!user_email) {
    return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.INCORRECT_EMAIL));
  }

  res.json(successResponse({}));
};

export const changePasswordWithCode = (req: Request, res: Response) => {
  const code = req.params.code;
  const { user_password, user_confirm_password }: User = req.body;

  if (!code) {
    return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, ERRORS.PASSWORD_RESET_LINK_INVALID));
  }

  if (!user_password || !user_confirm_password) {
    return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.PASSWORD_NOT_MATCH));
  }

  if (user_password != user_confirm_password) {
    return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.PASSWORD_NOT_MATCH));
  }
  if (!checkStrongPassword(user_password)) {
    return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.PASSWORD_NOT_STRONG));
  }
  res.json(successResponse({}));
};
