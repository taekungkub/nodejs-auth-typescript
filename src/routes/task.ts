import { Router } from "express";
const router = Router();
import { getTasks, createTask, getTask, updateTask, deleteTask } from "../controllers/taskController";

router.get("/tasks", getTasks);
router.post("/tasks", createTask);
router.get("/tasks/:id", getTask);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;
