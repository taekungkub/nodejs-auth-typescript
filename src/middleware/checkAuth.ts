import { NextFunction, Request, Response } from "express";
import { secretJWT } from "../config/globalConfig";
import { ERRORS } from "../helper/Errors";
import { getTokenBearer, errorResponse } from "../helper/utils";
import jwt from "jsonwebtoken";

export default function checkAuth(req: Request, res: Response, next: NextFunction) {
  const token = getTokenBearer(req);
  if (token) {
    jwt.verify(token, secretJWT, (err, decoded) => {
      if (err) {
        return res.json(errorResponse(403, ERRORS.TYPE.BAD_REQUEST, ERRORS.TOKEN_INVALID));
      }
      next();
    });
  } else {
    return res.json(errorResponse(403, ERRORS.TYPE.SERVER_ERROR, ERRORS.TOKEN_REQUIRED));
  }
}
