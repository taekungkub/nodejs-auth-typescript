import { NextFunction, Request, Response } from "express";
import { ERRORS } from "../helper/Errors";
import { getTokenBearer, errorResponse } from "../helper/utils";
import jwt from "jsonwebtoken";
import { secretJWTRefresh } from "../config/globalConfig";

export default function checkRefreshToken(req: Request, res: Response, next: NextFunction) {
  const token = req.body.refresh_token;

  if (token) {
    jwt.verify(token, secretJWTRefresh, (err: any, decoded: any) => {
      if (err) {
        return res.json(errorResponse(403, ERRORS.TYPE.BAD_REQUEST, ERRORS.TOKEN_INVALID));
      }
      next();
    });
  } else {
    return res.json(errorResponse(401, ERRORS.TYPE.SERVER_ERROR, ERRORS.TOKEN_REQUIRED));
  }
}
