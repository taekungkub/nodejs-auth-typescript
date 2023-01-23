import { Request, Response } from "express";
import { ChangepasswordSchemaBody, LoginSchemaBody, RegisterSchemaBody, UserTy } from "../Types/UserTy";
import { errorResponse, successResponse, getTokenBearer, signToken, hashPassword, comparePassword, decodedJWT } from "../helper/utils";
import { ERRORS } from "../helper/Errors";
let validator = require("validator");
import * as db from "../persistence/mysql/Order";
import { OrderProductTy, OrderTy } from "../Types/OrderTy";
import { RowTy } from "../Types/RowTy";

export const getAllOrder = async (req: Request, res: Response) => {
  const result = await db.getOrders();
  res.json(successResponse(result));
};
export const getOrderByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.getOrder(id);
    res.json(successResponse(result));
  } catch (error) {}
};
export const createOrder = async (req: Request, res: Response) => {
  try {
    const order: OrderTy = req.body;

    const result = (await db.createOrder(order)) as RowTy
    const order_id = result.insertId;
    const { order_product } = req.body;

    order_product.forEach(async (product: OrderProductTy) => {
      product.order_id = order_id;
    });

  let promises = order_product.map( async (product:OrderProductTy) => {
      product.order_id = order_id;
      await db.createOrderProduct(product);

  });
  await Promise.all(promises);




  } catch (error) {}
};
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order: OrderTy = req.body;
    const result = await db.updateOrder(order, id);
  } catch (error) {}
};
export const removeOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.removeOrder(id);
    res.json(successResponse(result));
  } catch (error) {}
};
