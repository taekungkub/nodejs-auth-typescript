import { NextFunction, Request, Response } from "express";
import { ERRORS } from "../helper/Errors";
import { errorResponse, getTokenBearer, decodedJWT } from "../helper/utils";
import { UserTy } from "../types/UserTy";
import * as db from "../persistence/mysql/User";

export default function checkRole(roles: Array<string>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = getTokenBearer(req);

      if (!token) {
        return res.json(errorResponse(403, ERRORS.TYPE.SERVER_ERROR, ERRORS.TOKEN_REQUIRED));
      }

      const decoded = (await decodedJWT(token)) as UserTy;
      const result = (await db.getUserByEmail(decoded.user_email)) as UserTy;

      if (roles.includes(result.role_title)) {
        next();
        return;
      }

      return res.json(errorResponse(403, ERRORS.TYPE.SERVER_ERROR, ERRORS.ROLE_NOT_ALLOW));
    } catch (error) {
      return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
    }
  };
}
