import { Router } from "express";
import * as productController from "../controllers/productController";

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

//------------ Product Route ------------//
router.get("/products", productController.getAllProduct);

router.get("/products/:id", productController.getProductById);

router.post("/products", upload.single("image"), productController.createProduct);

router.put("/products/:id", upload.single("image"), productController.updateProduct);

router.delete("/products/:id", productController.removeProduct);

export default router;
