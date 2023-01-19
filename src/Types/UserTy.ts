import * as Joi from "joi";
import { ERRORS } from "../config/Errors";

const patternPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$");
export type UserTy = {
  id: string;
  user_email: string;
  user_password: string;
  user_confirm_password: string;
  user_displayname?: string;
  user_tel?: string;
  user_password_hash: string;
  reset_password_token: string;
  is_verify: boolean;
  role_id: string;
};

export const LoginSchemaBody = Joi.object<UserTy>({
  user_email: Joi.string().email().required(),
  user_password: Joi.string().required(),
});

export const RegisterSchemaBody = Joi.object<UserTy>({
  user_email: Joi.string().email().required(),
  user_password: Joi.string().required().pattern(patternPassword).messages({
    "string.pattern.base": ERRORS.PASSWORD_NOT_STRONG,
  }),
  user_confirm_password: Joi.valid(Joi.ref("user_password")).messages({
    "any.only": ERRORS.PASSWORD_NOT_MATCH,
  }),
  user_displayname: Joi.allow(""),
  user_tel: Joi.allow(),
  is_verify: Joi.allow(),
  role_id: Joi.allow(),
});

export const ChangepasswordSchemaBody = Joi.object<UserTy>({
  user_password: Joi.string().required().pattern(patternPassword).messages({
    "string.pattern.base": ERRORS.PASSWORD_NOT_STRONG,
  }),
  user_confirm_password: Joi.valid(Joi.ref("user_password")).required().messages({
    "any.only": ERRORS.PASSWORD_NOT_MATCH,
  }),
});
