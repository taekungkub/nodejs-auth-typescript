import { Request } from "express";
var jwt = require("jsonwebtoken");
export const secretJWT = process.env.SECRET_JWT || "foobarsuper";
const bcrypt = require("bcrypt");
const saltRounds = 10;

export function errorResponse(statusCode: Number = 404, type: string, desc: any) {
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

export function checkStrongPassword(password: string) {
  const strongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$");
  return strongPassword.test(password);
}

export function getTokenBearer(req: Request) {
  const bearerHeader = req.headers["authorization"];

  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    return bearerToken;
  }
}

export function signToken(payload: any) {
  const token = jwt.sign(payload.toJSON(), secretJWT, { expiresIn: "30m" });
  return token;
}

export function decodedJWT(token: any) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretJWT, function (err: Error, decoded: any) {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
}

export function hashPassword(myPlaintextPassword: String) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(myPlaintextPassword, saltRounds, function (err: Error, hash: String) {
      if (err) throw err;
      resolve(hash);
    });
  });
}

export function comparePassword(myPlaintextPassword: String, passwordHash: String) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(myPlaintextPassword, passwordHash, function (err: Error, result: Boolean) {
      resolve(result);
    });
  });
}
