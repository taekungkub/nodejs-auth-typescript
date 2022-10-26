import { Router } from "express";
import { Request, Response } from "express";
import { ERRORS } from "../config/Errors";
import { successResponse, errorResponse } from "../config/utils";
import * as test from "../persistence/mysql/Product";
import { ProductSchemaBody, ProductTy } from "../Types/ProductTy";
import * as fs from "fs";
const router = Router();
const multer = require("multer");
const dest = "./public/data/uploads";
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, dest);
  },
  filename: function (req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now();
    let ext = file.originalname.substring(file.originalname.lastIndexOf("."), file.originalname.length);
    cb(null, file.originalname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage: storage });

interface MulterRequest extends Request {
  file: any;
}

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

router.post("/", upload.single("image"), async (req: Request, res: Response) => {
  try {
    const productData: ProductTy = req.body;
    const imageFile: FileTy = (req as MulterRequest).file;
    const { error }: any = ProductSchemaBody.validate(req.body);
    if (error) {
      return res.json(
        errorResponse(422, ERRORS.TYPE.BAD_REQUEST, {
          message: ERRORS.TYPE.BAD_REQUEST,
          data: error.message,
        })
      );
    }
    const result: any = await test.createProduct(productData, imageFile ? imageFile.filename : null);
    if (!result) {
      return res.send(errorResponse(404, ERRORS.TYPE.RESOURCE_NOT_FOUND, "Product not found"));
    }

    res.send(successResponse(result));
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.put("/:id", upload.single("image"), async (req: Request, res: Response) => {
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

    const find: ProductTy = (await test.getProduct(id)) as ProductTy;
    if (!find) {
      return res.json(errorResponse(400, ERRORS.TYPE.RESOURCE_NOT_FOUND, "Not found product"));
    }

    if (find.image) {
      fs.unlink(`${dest}/${find.image}`, (err: any) => {});
    }

    const imageFile: FileTy = (req as MulterRequest).file;
    const result = await test.updateProduct(productData, imageFile ? imageFile.filename : null, id);
    res.send(successResponse(result));
  } catch (error) {
    res.send(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const find: ProductTy = (await test.getProduct(id)) as ProductTy;
    if (!find) {
      return res.json(errorResponse(400, ERRORS.TYPE.RESOURCE_NOT_FOUND, "Not found product"));
    }

    if (find.image) {
      fs.unlink(`${dest}/${find.image}`, (err: any) => {});
    }

    const result = await test.removeProduct(id);
    res.send(successResponse(result));
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
