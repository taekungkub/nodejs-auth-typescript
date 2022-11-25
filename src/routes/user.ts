import { Router } from "express";

const router = Router();
import * as UserController from "../controllers/userController";

//------------ User Route ------------//
router.get("/", UserController.getAllUser);
router.get("/:id", UserController.getUserById);
router.post("/", UserController.createUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.removeUser);
module.exports = router;
