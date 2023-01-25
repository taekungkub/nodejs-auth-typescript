import { Router } from "express";
import { enumRole } from "../config/globalConfig";
import * as orderController from "../controllers/orderController";
import checkRole from "../middleware/checkRole";

const router = Router();

//------------ orders Route ------------//
router.get("/", checkRole([enumRole.admin, enumRole.staff]), orderController.getAllOrder);
router.get("/:id", orderController.getOrderById);
router.get("/user/:id", orderController.getOrderByUserId);
router.post("/", orderController.createOrder);
router.put("/:id", orderController.updateOrder);
router.post("/:id", orderController.removeOrder);

export default router;
