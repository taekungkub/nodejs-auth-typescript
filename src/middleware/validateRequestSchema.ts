import { RequestHandler } from "express";
import { Schema, ZodError } from "zod";
import { errorResponse } from "../helper/utils";
import { ERRORS } from "../helper/Errors";
import { ValidationError, fromZodError } from "zod-validation-error";

const validateRequestSchema =
  (schema: Schema): RequestHandler =>
  async (req, res, next) => {
    try {
      await schema.parseAsync(req);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.json(errorResponse(400, ERRORS.TYPE.BAD_REQUEST, validationError.message));
        // return res.json(errorResponse(400, ERRORS.TYPE.BAD_REQUEST, validationError.details[0].message)); // กรณี return ทีละ field
      } else {
        next(error);
      }
    }
  };

export default validateRequestSchema;
