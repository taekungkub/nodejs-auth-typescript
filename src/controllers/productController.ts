import { Request, Response } from "express";
import { errorResponse, successResponse, getTokenBearer, signToken, hashPassword, comparePassword, decodedJWT } from "../helper/utils";
import { ERRORS } from "../helper/Errors";
import * as db from "../persistence/mysql/Product";
import * as fs from "fs";
import { ProductSchemaBody, ProductTy } from "../types/ProductTy";

interface FileTy {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename?: string;
  path: string;
  size: number;
}

interface MulterRequest extends Request {
  file: any;
}

const dest = "./public/data/uploads";

export async function getAllProduct(req: Request, res: Response) {
  const result = await db.getProducts();
  if (!result) {
    return res.send(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, "Product not found"));
  }
  res.send(successResponse(result));
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await db.getProduct(id);
    if (!result) {
      return res.send(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, "Product not found"));
    }
    res.send(successResponse(result));
  } catch (error) {
    res.send(error);
  }
}
export async function createProduct(req: Request, res: Response) {
  try {
    const productData: ProductTy = req.body;
    const { error }: any = ProductSchemaBody.validate(req.body);
    if (error) {
      return res.json(
        errorResponse(422, ERRORS.TYPE.BAD_REQUEST, {
          message: ERRORS.TYPE.BAD_REQUEST,
          data: error.message,
        })
      );
    }
    const imageFile: FileTy = (req as MulterRequest).file;
    const result: any = await db.createProduct(productData, imageFile ? imageFile.filename : undefined);
    res.send(successResponse(result));
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}
export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const productData: ProductTy = req.body;

    const { error }: any = ProductSchemaBody.validate(req.body);
    if (error) {
      return res.json(
        errorResponse(422, ERRORS.TYPE.BAD_REQUEST, {
          message: ERRORS.TYPE.BAD_REQUEST,
          data: error.message,
        })
      );
    }

    const product: ProductTy = (await db.getProduct(id)) as ProductTy;

    if (product.image) {
      fs.unlink(`${dest}/${product.image}`, (err: any) => {});
    }

    const imageFile: FileTy = (req as MulterRequest).file;
    const result = await db.updateProduct(productData, imageFile ? imageFile.filename : null, id);
    res.send(successResponse(result));
  } catch (error) {
    res.json(errorResponse(400, ERRORS.TYPE.SERVER_ERROR, error));
  }
}
export async function removeProduct(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const product: ProductTy = (await db.getProduct(id)) as ProductTy;

    if (product.image) {
      fs.unlink(`${dest}/${product.image}`, (err: any) => {});
    }

    const result = await db.removeProduct(id);
    res.send(successResponse(result));
  } catch (error) {
    return res.json(errorResponse(400, ERRORS.TYPE.SERVER_ERROR, error));
  }
}
