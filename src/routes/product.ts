import { Router } from "express";
import multer from "multer";
import * as productController from "@/controllers/productController";
import { productImageUpload } from "@/middleware/imageUpload";

const router = Router();
//------------ Product Route ------------//
router.get("/products", productController.getAllProduct);
router.get("/products/:id", productController.getProductById);
router.post("/products", productImageUpload.array("images"), productController.createProduct);
// router.put("/products/:id", productImageUpload.array("images"), productController.updateProduct);
// router.delete("/products/:id", productController.removeProduct);

export default router;
