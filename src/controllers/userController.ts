import { Request, Response } from "express";
import { RegisterSchemaBody, UserTy } from "../Types/UserTy";
import { errorResponse, successResponse, getTokenBearer, signToken, hashPassword, comparePassword, decodedJWT } from "../helper/utils";
import { ERRORS } from "../helper/Errors";
import test from "../persistence/mysql/User";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { user_email, user_password, user_confirm_password, user_displayname, user_tel, is_verify }: UserTy = req.body;
    const { role_id }: any = req.body;
    const { error }: any = RegisterSchemaBody.validate(req.body);
    if (error) {
      return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, error.message));
    }

    let userList = (await test.getUsers()) as Array<any>;
    const existEmail = userList.find((v: any) => v.user_email === user_email);
    if (existEmail) return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_ALREADY_EXISTS));

    const passwordHash = await hashPassword(user_password);

    const result: any = await test.createUser({ ...req.body, user_password_hash: passwordHash });
    await test.updateStatusVerify(!is_verify ? false : true, user_email);

    if (result) {
      if (role_id) {
        await test.addRoleUser(role_id, result.insertId);
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
    if (!result) {
      return res.send(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, "User not found"));
    }
    res.send(successResponse(result));
  } catch (error) {
    return res.json(errorResponse(400, ERRORS.TYPE.BAD_REQUEST, error));
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await test.getUserById(id);
    if (!result) {
      return res.send(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND));
    }
    res.send(successResponse(result));
  } catch (error) {
    return res.json(errorResponse(400, ERRORS.TYPE.BAD_REQUEST, error));
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userData: UserTy = req.body;
    const { id } = req.params;
    const { role_id } = req.body;
    await test.getUserById(id);

    const result = await test.updateUser(userData, id);

    if (!result) {
      return res.send(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, "User not found"));
    }

    if (role_id) {
      const userData: UserTy = await test.getUserById(id);
      if (!userData.role_id) {
        const result2 = await test.addRoleUser(role_id, id);
      } else {
        const result2 = await test.updateRoleUser(role_id, id);
      }
    }

    res.send(successResponse(result));
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await test.getUserById(id);
    const result = await test.removeUser(id);
    if (!result) {
      return res.send(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, "Error updating user"));
    }
    res.send(successResponse(result));
  } catch (error) {
    return res.json(errorResponse(400, ERRORS.TYPE.BAD_REQUEST, error));
  }
};
