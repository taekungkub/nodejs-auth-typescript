import { Router } from "express";
import * as UserController from "../controllers/userController";
const router = Router();

//------------ User Route ------------//
router.get("/users", UserController.getAllUser);
router.get("/users/:id", UserController.getUserById);
router.post("/users", UserController.createUser);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.removeUser);

export default router;
