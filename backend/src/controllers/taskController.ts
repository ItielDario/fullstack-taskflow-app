import type { Request, Response } from "express"
import { createTask } from "../models/taskModel.js"

export async function createTaskController(req: Request, res: Response) {
    const { title, description } = req.body as { title?: string; description?: string }

    if (!title || title.trim() === "") {
        res.status(400).json({ error: "O título é obrigatório" })
        return
    }

    try {
        const task = await createTask({
            title,
            description: description ?? null,
        })
        res.status(201).json(task)
    } catch {
        res.status(500).json({ error: "Erro interno ao criar a tarefa" })
    }
}