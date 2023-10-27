import { Router } from "express";
import * as productController from "@/controllers/productController";
import { productImageUpload } from "@/middleware/imageUpload";
import validateRequestSchema from "@/middleware/validateRequestSchema";
import { productSchema } from "@/validation/product.schema";

const router = Router();
//------------ Product Route ------------//
router.get("/products", productController.getAllProduct);
router.get("/products/:id", productController.getProductById);
router.post("/products", productImageUpload.array("images"), validateRequestSchema(productSchema), productController.createProduct);
router.put("/products/:id", productImageUpload.array("images"), validateRequestSchema(productSchema), productController.updateProduct);
router.delete("/products/:id", productController.removeProduct);

export default router;
