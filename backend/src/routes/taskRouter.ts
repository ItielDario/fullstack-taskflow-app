import { Router } from "express"
import { createTaskController } from "../controllers/taskController.js"
 
const router = Router()
 
router.post("/tasks", createTaskController)
 
export default router