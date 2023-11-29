import { Request, Response } from "express";
import { errorResponse, successResponse } from "@/helper/utils";
import { ERRORS } from "@/helper/Errors";
import { ProductTy } from "@/types/ProductTy";
import { productDest } from "@/middleware/imageUpload";
import * as db from "@/persistence/mysql/Product";
import * as fs from "fs";
import sharp from "sharp";

export async function getAllProduct(req: Request, res: Response) {
  try {
    const products = await db.getProducts();

    if (!products) {
      return res.send(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, "Product not found"));
    }
    res.send(successResponse(products));
  } catch (error) {}
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await db.getProductById(id);

    if (!product) {
      return res.send(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, "Product not found"));
    }
    res.send(
      successResponse({
        ...product,
        images: JSON.parse(String(product.images)),
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
    const productPics = req.files as Express.Multer.File[];

    let profilePicDestinationPath: Array<string> = [];

    productPics.map(async (file, i) => {
      const timestamp = Date.now();
      const ext = file.originalname.split(".").pop();
      const fileName = `file_${timestamp}_${i}.${ext}`;
      const path = `${productDest}/${fileName}`;
      profilePicDestinationPath.push(fileName);
      await sharp(file.buffer).toFile(path);
    });

    const result = await db.createProduct(productData, JSON.stringify(profilePicDestinationPath));
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
    const product = await db.getProductById(id);
    const productPics = req.files as Express.Multer.File[];
    let profilePicDestinationPath: Array<string> = [];

    if (productPics.length) {
      const imagesList = JSON.parse(product.images);

      imagesList.map((file: string) => {
        fs.unlink(`${productDest}/${file}`, (err) => {});
      });

      productPics.map(async (file, i) => {
        const timestamp = Date.now();
        const ext = file.originalname.split(".").pop();
        const fileName = `file_${timestamp}_${i}.${ext}`;
        const path = `${productDest}/${fileName}`;
        profilePicDestinationPath.push(fileName);
        await sharp(file.buffer).toFile(path);
      });
    }

    await db.updateProduct(productData, JSON.stringify(profilePicDestinationPath), id);

    res.send(
      successResponse({
        productId: product.id,
      })
    );
  } catch (error) {
    res.json(errorResponse(400, ERRORS.TYPE.SERVER_ERROR, error));
  }
}
export async function removeProduct(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const product = await db.getProductById(id);

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
