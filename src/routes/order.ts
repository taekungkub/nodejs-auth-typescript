import { Router } from "express";
import * as orderController from "../controllers/orderController";

const router = Router();

//------------ orders Route ------------//
router.get("/", orderController.getAllOrder);
router.get("/:id", orderController.getOrderById);
router.get("/user/:id", orderController.getOrderByUserId);

router.post("/", orderController.createOrder);

router.put("/:id", orderController.updateOrder);

router.delete("/:id", orderController.removeOrder);

export default router;
