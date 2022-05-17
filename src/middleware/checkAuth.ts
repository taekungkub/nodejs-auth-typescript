import { NextFunction, Request, Response } from "express";
import { ERRORS } from "../config/Errors";
import { getTokenBearer, secretJWT, errorResponse } from "../config/utils";
var jwt = require("jsonwebtoken");

export default function checkAuth(req: Request, res: Response, next: NextFunction) {
  const token = getTokenBearer(req);
  if (token) {
    jwt.verify(token, secretJWT, (err: Error, decoded: object) => {
      if (err) {
        return res.json(errorResponse(403, ERRORS.TYPE.BAD_REQUEST, ERRORS.TOKEN_INVALID));
      }
      next();
    });
  } else {
    return res.json(errorResponse(403, ERRORS.TYPE.SERVER_ERROR, ERRORS.TOKEN_REQUIRED));
  }
}
