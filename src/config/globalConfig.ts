import * as dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const enumRole = {
  admin: "admin",
  staff: "staff",
  user: "user",
};

export const secretJWT = process.env.SECRET_JWT ?? "foobarsuper";
export const secretJWTRefresh = process.env.SECRET_JWT_REFRESH ?? "snakelionbird";

export const nodemailerCredentials = {
  email: process.env.EMAIL_GOOGLE,
  password: process.env.EMAIL_GOOGLE_PASSWORD,
};
