import { Router } from "express";
import { Request, Response } from "express";
import { ERRORS } from "../config/Errors";
import { successResponse, errorResponse } from "../config/utils";
const router = Router();
import * as test from "../persistence/mysql/Product";
import { ProductSchemaBody, ProductTy } from "../Types/ProductTy";

//------------ Product Route ------------//
router.get("/", async (req: Request, res: Response) => {
  const result = await test.getProducts();
  if (!result) {
    return res.send(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, "Product not found"));
  }
  res.send(successResponse(result));
});
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await test.getProduct(id);
    if (!result) {
      return res.send(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, "Product not found"));
    }
    res.send(successResponse(result));
  } catch (error) {
    res.send(error);
  }
});
router.post("/", async (req: Request, res: Response) => {
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

    const result: any = await test.createProduct(productData);

    if (!result) {
      return res.send(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, "Product not found"));
    }
    const result2 = await test.addProductCatagory(result.insertId, productData);

    res.send(successResponse(result));
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

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

    const find = await test.getProduct(id);
    if (!find) {
      return res.json(errorResponse(400, ERRORS.TYPE.RESOURCE_NOT_FOUND, "Not found product"));
    }

    const result = await test.updateProduct(productData, id);
    res.send(successResponse(result));
  } catch (error) {
    res.send(error);
  }
});
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const find = await test.getProduct(id);
    if (!find) {
      return res.json(errorResponse(400, ERRORS.TYPE.RESOURCE_NOT_FOUND, "Not found product"));
    }

    const result = await test.removeProduct(id);
    res.send(successResponse(result));
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
