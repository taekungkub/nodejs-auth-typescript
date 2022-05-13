import { NextFunction, Request, Response } from "express";
import { ERRORS } from "../config/Errors";
import { getTokenBearer, secretJWT } from "../config/utils";
var jwt = require("jsonwebtoken");

export default function checkAuth(req: Request, res: Response, next: NextFunction) {
  const token = getTokenBearer(req);
  if (token) {
    jwt.verify(token, secretJWT, (err: Error, decoded: object) => {
      if (err) {
        return res.json({
          statusCode: 403,
          detail: "Error",
          error: {
            type: ERRORS.TYPE.BAD_REQUEST,
            description: ERRORS.TOKEN_INVALID,
          },
        });
      }
      next();
    });
  } else {
    // Forbidden
    res.json({
      statusCode: 403,
      detail: "Error",
      error: {
        type: ERRORS.TYPE.SERVER_ERROR,
        description: ERRORS.TOKEN_REQUIRED,
      },
    });
  }
}
