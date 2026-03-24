import { Router } from "express"
import {
    createTaskController,
    getAllTasksController,
    getTaskByIdController,
    updateTaskController,
    completeTaskController,
    deleteTaskController,
} from "../controllers/taskController.js"

const router = Router()

router.post("/tasks", createTaskController)
router.get("/tasks", getAllTasksController)
router.get("/tasks/:id", getTaskByIdController)
router.put("/tasks/:id", updateTaskController)
router.patch("/tasks/:id/complete", completeTaskController)
router.delete("/tasks/:id", deleteTaskController)

export default router