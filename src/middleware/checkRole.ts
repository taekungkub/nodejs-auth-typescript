import { NextFunction, Request, Response } from "express";
import { ERRORS } from "../helper/Errors";
import { errorResponse, getTokenBearer, decodedJWT } from "../helper/utils";
import { UserTy } from "../Types/UserTy";

export default function checkRole(roles: Array<string>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = getTokenBearer(req);
    const decoded = (await decodedJWT(token)) as UserTy;

    if (roles.includes(decoded.role_title)) {
      next();
      return;
    }

    return res.json(errorResponse(403, ERRORS.TYPE.SERVER_ERROR, ERRORS.ROLE_NOT_ALLOW));
  };
}
