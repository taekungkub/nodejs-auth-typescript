import { NextFunction, Request, Response } from "express";
import { ERRORS } from "@/helper/Errors";
import { errorResponse, getTokenBearer, decodedJWT } from "@/helper/utils";
import { UserJwtTy, UserTy } from "@/types/UserTy";
import * as db from "@/persistence/mysql/User";
import { RoleTy } from "../config/globalConfig";

export default function checkRole(roles: Array<RoleTy>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = getTokenBearer(req);

      if (!token) {
        return res.json(errorResponse(403, ERRORS.TYPE.SERVER_ERROR, ERRORS.TOKEN_REQUIRED));
      }

      const decoded = (await decodedJWT(token)) as UserJwtTy;
      const user = await db.getUserByEmail(decoded.user_email);

      if (roles.includes(user.role_title as RoleTy)) {
        next();
        return;
      }

      return res.json(errorResponse(403, ERRORS.TYPE.SERVER_ERROR, ERRORS.ROLE_NOT_ALLOW));
    } catch (error) {
      return res.json(errorResponse(404, ERRORS.TYPE.SERVER_ERROR, error));
    }
  };
}
