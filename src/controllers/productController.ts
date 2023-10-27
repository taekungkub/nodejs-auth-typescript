import { Request, Response } from "express";
import { errorResponse, successResponse } from "@/helper/utils";
import { ERRORS } from "@/helper/Errors";
import * as db from "@/persistence/mysql/Product";
import * as fs from "fs";
import { ProductTy } from "@/types/ProductTy";
import { ResultSetHeader } from "mysql2";
import { productDest } from "@/middleware/imageUpload";

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
    const result = (await db.getProduct(id)) as ProductTy;

    if (!result) {
      return res.send(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, "Product not found"));
    }
    res.send(
      successResponse({
        ...result,
        images: JSON.parse(String(result.images)),
      })
    );
  } catch (error) {
    res.json(errorResponse(400, ERRORS.TYPE.SERVER_ERROR, error));
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    if (!req.files?.length) {
      return res.status(400).json(errorResponse(400, ERRORS.TYPE.BAD_REQUEST, "No file uploaded or file rejected."));
    }

    const productData: ProductTy = req.body;

    // const { error } = ProductSchemaBody.validate(req.body);

    // if (error) {
    //   const files = req.files as Express.Multer.File[];
    //   if (files.length) {
    //     files.map((file) => {
    //       fs.unlink(`${file.path}`, (err) => {});
    //     });
    //   }

    //   return res.json(errorResponse(400, ERRORS.TYPE.BAD_REQUEST, error.message));
    // }

    //wait make for save image product

    const files = req.files as Express.Multer.File[];
    const filenames = files.map((file) => file.filename);
    const result = (await db.createProduct(productData, JSON.stringify(filenames))) as ResultSetHeader;
    res.send(
      successResponse({
        productId: result.insertId,
      })
    );
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}
export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const productData: ProductTy = req.body;

    // const { error }: any = ProductSchemaBody.validate(req.body);

    // if (error) {
    //   return res.json(errorResponse(400, ERRORS.TYPE.BAD_REQUEST, error.message));
    // }

    const product: ProductTy = (await db.getProduct(id)) as ProductTy;

    const imagesList = JSON.parse(product.images);

    if (imagesList.length > 0) {
      imagesList.map((file: string) => {
        fs.unlink(`${productDest}/${file}`, (err) => {});
      });
    }

    const files = req.files as Express.Multer.File[];
    const filenames = files.map((file) => file.filename);

    await db.updateProduct(productData, JSON.stringify(filenames), id);
    const result = (await db.getProduct(id)) as ProductTy;

    res.send(
      successResponse({
        productId: result.id,
      })
    );
  } catch (error) {
    res.json(errorResponse(400, ERRORS.TYPE.SERVER_ERROR, error));
  }
}
export async function removeProduct(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const product: ProductTy = (await db.getProduct(id)) as ProductTy;

    const imagesList = JSON.parse(product.images);

    if (imagesList.length > 0) {
      imagesList.map((file: string) => {
        fs.unlink(`${productDest}/${file}`, (err) => {});
      });
    }

    await db.removeProduct(id);

    res.send(
      successResponse({
        productId: id,
      })
    );
  } catch (error) {
    return res.json(errorResponse(400, ERRORS.TYPE.SERVER_ERROR, error));
  }
}
