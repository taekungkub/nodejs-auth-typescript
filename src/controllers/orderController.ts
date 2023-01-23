import { Request, Response } from "express";
import { ChangepasswordSchemaBody, LoginSchemaBody, RegisterSchemaBody, UserTy } from "../Types/UserTy";
import { errorResponse, successResponse, getTokenBearer, signToken, hashPassword, comparePassword, decodedJWT } from "../helper/utils";
import { ERRORS } from "../helper/Errors";
let validator = require("validator");
import * as test from "../persistence/mysql/order";

export const getAllOrder = async (req: Request, res: Response) => {
  const result = await test.getOrders();
  res.json(successResponse(result));
};
export const getOrderByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await test.getOrder(id);
  res.json(successResponse(result));
};
export const createOrder = async (req: Request, res: Response) => {};
export const updateOrder = async (req: Request, res: Response) => {};
export const removeOrder = async (req: Request, res: Response) => {};
