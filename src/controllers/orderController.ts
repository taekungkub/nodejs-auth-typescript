import { Request, Response } from "express";
import { errorResponse, successResponse } from "../helper/utils";
import { ERRORS } from "../helper/Errors";

let validator = require("validator");
import * as db from "../persistence/mysql/Order";
import { OrderProductTy, OrderTy } from "../Types/OrderTy";
import { RowTy } from "../Types/RowTy";
import { ProductCartTy, ProductTy } from "../Types/ProductTy";

export const getAllOrder = async (req: Request, res: Response) => {
  const result = await db.getOrders();
  res.json(successResponse(result));
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = (await db.getOrder(id)) as OrderTy;
    const products = await db.getOrderProduct(result.id);
    res.json(successResponse({ ...result, products: products }));
  } catch (error) {
    console.log(error);
  }
};

export const getOrderByUserId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = (await db.getOrderUser(id)) as Array<any>;

    const promises = result.map(async (order: OrderTy) => {
      const products = await db.getOrderProduct(order.id);
      return Object.assign(
        {
          ...order,
          products: products,
        },
        {}
      );
    });
    const orders = await Promise.all(promises);

    const result2 = res.json(
      successResponse({
        orders: orders,
      })
    );
  } catch (error) {
    console.log(error);
  }
};
export const createOrder = async (req: Request, res: Response) => {
  try {
    const order: OrderTy = req.body;
    const order_products = req.body.order_product as Array<ProductCartTy>;

    const result = (await db.createOrder(order)) as RowTy;
    const order_id = result.insertId;
    let promises = order_products.map(async (product: ProductCartTy) => {
      console.log(product);
      await db.createOrderProduct(order_id, product.id, product.qty);
    });
    await Promise.all(promises);
    res.send(successResponse("checkout sucessfully"));
  } catch (error) {
    console.log(error);
  }
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
