import { Router } from "express";
import * as orderController from "../controllers/orderController";

const router = Router();

//------------ Order Route ------------//
router.get("/", orderController.getAllOrder);

router.get("/:id", orderController.getOrderByID);

router.post("/", orderController.createOrder);

router.put("/:id", orderController.updateOrder);

router.delete("/:id", orderController.removeOrder);

export default router;
