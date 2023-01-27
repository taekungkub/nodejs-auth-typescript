import { PassportService } from "../config/passportService";
import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../helper/utils";
import { ERRORS } from "../helper/Errors";

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  PassportService.passport.authenticate("jwt", { session: false }, function (err, user, info) {
    if (err) {
      return res.json(errorResponse(403, ERRORS.TYPE.SERVER_ERROR, ERRORS.TYPE.SERVER_ERROR));
    }

    if (!user) {
      return res.json(errorResponse(403, ERRORS.TYPE.SERVER_ERROR, ERRORS.TOKEN_INVALID));
    }
    req.user = user; // Forward user information to the next middleware

    next();
  })(req, res, next);
}
