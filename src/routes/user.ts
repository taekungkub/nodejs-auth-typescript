import { Router } from "express";
import * as UserController from "../controllers/userController";
const router = Router();

//------------ User Route ------------//
router.get("/", UserController.getAllUser);
router.get("/:id", UserController.getUserById);
router.post("/", UserController.createUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.removeUser);

export default router;
