import { Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const secretJWT = process.env.SECRET_JWT || "foobarsuper";
export const secretJWTRefresh = process.env.SECRET_JWT_REFRESH || "snakelionbird";

const saltRounds = 10;

export function errorResponse(statusCode: Number = 404, type: string, desc?: any) {
  return {
    statusCode: statusCode,
    detail: "Error",
    error: {
      type: type,
      description: desc,
    },
  };
}

export function successResponse(data: any) {
  return {
    statusCode: 200,
    detail: "Success",
    data: data,
  };
}

export function getTokenBearer(req: Request) {
  const bearerHeader = req.headers["authorization"];

  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    return bearerToken;
  }

  return null;
}

export function signToken(payload: any) {
  delete payload.user_password;
  delete payload.verify_token;
  delete payload.reset_password_token;
  const token = jwt.sign(payload, secretJWT, { expiresIn: "5h" });
  return token;
}

export function decodedJWT(token: any) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretJWT, (err: any, decoded: any) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
}

export function decodeJwtRefresh(token: any) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretJWTRefresh, (err: any, decoded: any) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
}

export function hashPassword(myPlaintextPassword: string) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(myPlaintextPassword, saltRounds, (err, hash: string) => {
      if (err) throw err;
      resolve(hash);
    });
  });
}

export function comparePassword(myPlaintextPassword: string, passwordHash: string) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(myPlaintextPassword, passwordHash, (err, result: Boolean) => {
      resolve(result);
    });
  });
}

export function jwtGenerate(user: any) {
  delete user.user_password;
  delete user.verify_token;
  delete user.reset_password_token;
  const accessToken = jwt.sign(user, secretJWT, { expiresIn: "30s" });
  return accessToken;
}

export const jwtRefreshTokenGenerate = (user: any) => {
  delete user.user_password;
  delete user.verify_token;
  delete user.reset_password_token;
  const refreshToken = jwt.sign(user, secretJWTRefresh, {
    expiresIn: "5m",
  });

  return refreshToken;
};
