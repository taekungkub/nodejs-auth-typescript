import { Router } from "express";
import * as orderController from "@/controllers/orderController";
import checkRole from "@/middleware/checkRole";

const router = Router();

//------------ orders Route ------------//
router.get("/orders", checkRole(["admin", "staff"]), orderController.getAllOrder);
router.get("/orders/:id", orderController.getOrderById);
router.get("/orders/user/:id", orderController.getOrderByUserId);
router.post("/orders", orderController.createOrder);
router.put("/orders/:id", orderController.updateOrder);
router.post("/orders/:id", orderController.removeOrder);

export default router;
