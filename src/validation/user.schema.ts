import { ERRORS } from "@/helper/Errors";
import { z } from "zod";

const regexStrongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$");

export const loginSchema = z.object({
  body: z.object({
    user_email: z.string().nonempty({ message: "Email cant empty" }).email({ message: "Invalid email" }),
    user_password: z.string().nonempty({ message: "Password cant empty" }),
  }),
});

export type LoginSchemaBody = z.infer<typeof loginSchema>["body"];

export const registerSchema = z.object({
  body: z
    .object({
      user_email: z.string().email(),
      user_password: z.string().refine((value) => regexStrongPassword.test(value), ERRORS.PASSWORD_NOT_STRONG),
      user_confirm_password: z.string(),
    })
    .refine((data) => data.user_password === data.user_confirm_password, {
      message: ERRORS.PASSWORD_NOT_MATCH,
      path: ["user_confirm_password"],
    }),
});

export type RegisterSchemaBody = z.infer<typeof registerSchema>["body"];

export const changepasswordSchema = z.object({
  body: z
    .object({
      user_password: z.string().refine((value) => regexStrongPassword.test(value), ERRORS.PASSWORD_NOT_STRONG),
      user_confirm_password: z.string(),
      current_password: z.string(),
    })
    .refine((data) => data.user_password === data.user_confirm_password, {
      message: ERRORS.PASSWORD_NOT_MATCH,
      path: ["user_confirm_password"],
    }),
});

export type ChangepasswordSchemaBody = z.infer<typeof changepasswordSchema>["body"];

export const changepasswordWithCodeSchema = z.object({
  body: z
    .object({
      user_password: z.string().refine((value) => regexStrongPassword.test(value), ERRORS.PASSWORD_NOT_STRONG),
      user_confirm_password: z.string(),
    })
    .refine((data) => data.user_password === data.user_confirm_password, {
      message: ERRORS.PASSWORD_NOT_MATCH,
      path: ["user_confirm_password"],
    }),
  params: z.object({
    code: z.string({ required_error: `Code is required` }),
  }),
});

export type ChangepasswordWithCodeSchemaBody = z.infer<typeof changepasswordWithCodeSchema>["body"];
