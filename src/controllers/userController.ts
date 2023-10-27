import { Request, Response } from "express";
import { UserTy } from "../types/UserTy";
import { errorResponse, successResponse, hashPassword } from "../helper/utils";
import { ERRORS } from "../helper/Errors";
import * as db from "../persistence/mysql/User";
import { RedisService } from "../config/redisService";
const redisListKey = "user:userList";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { user_email, user_password, user_confirm_password, user_displayname, user_tel, is_verify }: UserTy = req.body;
    const { role_id }: any = req.body;
    // const { error }: any = RegisterSchemaBody.validate(req.body);
    // if (error) {
    //   return res.json(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, error.message));
    // }

    let userList = (await db.getUsers()) as Array<any>;
    const existEmail = userList.find((v: any) => v.user_email === user_email);
    if (existEmail) return res.json(errorResponse(404, ERRORS.TYPE.BAD_REQUEST, ERRORS.EMAIL_ALREADY_EXISTS));

    const passwordHash = await hashPassword(user_password);

    const result: any = await db.createUser({ ...req.body, user_password_hash: passwordHash });
    await db.updateStatusVerify(!is_verify ? false : true, user_email);

    if (result) {
      if (role_id) {
        await db.addRoleUser(role_id, result.insertId);
      }

      res.json(successResponse("Create user success."));
    }
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const cachedData = await RedisService.getCache(redisListKey);

    if (cachedData) {
      return res.send(successResponse(JSON.parse(cachedData)));
    }

    const result = await db.getUsers();
    RedisService.setCache(redisListKey, 10, result);
    res.send(successResponse(result));
  } catch (error) {
    return res.json(errorResponse(400, ERRORS.TYPE.BAD_REQUEST, error));
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let cachedData = await RedisService.getCache(id);

    if (cachedData) {
      return res.send(successResponse(JSON.parse(cachedData)));
    }

    const result: UserTy = await db.getUserById(id);
    RedisService.setCache(id, 20, result);
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
    const user: UserTy = await db.getUserById(id);

    const result = await db.updateUser(userData, id);

    if (role_id) {
      if (!user.role_id) {
        await db.addRoleUser(role_id, id);
      } else {
        await db.updateRoleUser(role_id, id);
      }
    }
    RedisService.clearCache(id);
    res.send(successResponse(result));
  } catch (error) {
    return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.getUserById(id);
    const result = await db.removeUser(id);

    RedisService.clearCache(id);
    RedisService.clearCache(redisListKey);

    res.send(successResponse(result));
  } catch (error) {
    return res.json(errorResponse(400, ERRORS.TYPE.BAD_REQUEST, error));
  }
};
