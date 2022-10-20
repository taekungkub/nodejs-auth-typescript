import { Request, Response } from "express";
import { RegisterSchemaBody, UserTy } from "../Types/User";
import { errorResponse, successResponse, getTokenBearer, signToken, hashPassword, comparePassword, decodedJWT } from "../config/utils";
import { ERRORS } from "../config/Errors";
let validator = require("validator");
import test from "../persistence/mysql/User";
import { text } from "body-parser";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { user_email, user_password, user_confirm_password, user_displayname, user_tel, is_verify }: UserTy = req.body;
    const { role_id }: any = req.body;
    const { error }: any = RegisterSchemaBody.validate(req.body);
    if (error) {
      return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, error.message));
    }
    const passwordHash = await hashPassword(user_password);

    let userList: Array<string | number> = (await test.getUsers()) as Array<string | number>;
    const existEmail = userList.find((v: any) => v.user_email === user_email);
    if (existEmail) return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_ALREADY_EXISTS));

    const result: any = await test.createUser({ ...req.body, user_password_hash: passwordHash });
    const result2 = await test.updateStatusVerify(!is_verify ? false : true, user_email);

    if (result) {
      if (role_id) {
        const result3 = await test.addRoleUser(role_id, result.insertId);
      }

      res.json(successResponse("Create user success."));
    }
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await test.getUsers();
    if (result) {
      res.send(successResponse(result));
    }
  } catch (error) {
    return res.json(errorResponse(400, ERRORS.TYPE.BAD_REQUEST, error));
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await test.getUserById(id);
    res.send(successResponse(result));
  } catch (error) {
    res.send(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userData: UserTy = req.body;
    const userId = req.params.id;
    const { role_id } = req.body;
    const result = await test.updateUser(userData, userId);
    if (role_id) {
      const userData: UserTy = (await test.getUserById(userId)) as UserTy;
      if (!userData.role_id) {
        const result2 = await test.addRoleUser(role_id, userId);
      } else {
        const result2 = await test.updateRoleUser(role_id, userId);
      }
    }

    res.send(successResponse(result));
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await test.removeUser(userId);
    if (result) {
      res.send(successResponse(result));
    }
  } catch (error) {
    return res.json(errorResponse(400, ERRORS.TYPE.BAD_REQUEST, error));
  }
};
