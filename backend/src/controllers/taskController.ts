import type { Request, Response } from "express"
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    completeTask,
    deleteTask,
} from "../models/taskModel.js"

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

export async function getAllTasksController(_req: Request, res: Response) {
    try {
        const tasks = await getAllTasks()
        res.status(200).json(tasks)
    } catch {
        res.status(500).json({ error: "Erro interno ao buscar as tarefas" })
    }
}

export async function getTaskByIdController(req: Request, res: Response) {
    const { id } = req.params

    // Se o id não existir ou não for string, para aqui
    if (!id || typeof id !== 'string') {
        res.status(400).json({ error: "ID inválido" })
        return
    }

    try {
        const task = await getTaskById(id)

        if (!task) {
            res.status(404).json({ error: "Tarefa não encontrada" })
            return
        }

        res.status(200).json(task)
    } catch {
        res.status(500).json({ error: "Erro interno ao buscar a tarefa" })
    }
}

export async function updateTaskController(req: Request, res: Response) {
    const { id } = req.params
    const { title, description } = req.body as { title?: string; description?: string }

    // Se o id não existir ou não for string, para aqui
    if (!id || typeof id !== 'string') {
        res.status(400).json({ error: "ID inválido" })
        return
    }

    if (!title || title.trim() === "") {
        res.status(400).json({ error: "O título é obrigatório" })
        return
    }

    try {
        const existing = await getTaskById(id)

        if (!existing) {
            res.status(404).json({ error: "Tarefa não encontrada" })
            return
        }

        const task = await updateTask(id, {
            title,
            description: description ?? null,
        })

        res.status(200).json(task)
    } catch {
        res.status(500).json({ error: "Erro interno ao atualizar a tarefa" })
    }
}

export async function completeTaskController(req: Request, res: Response) {
    const { id } = req.params

    // Se o id não existir ou não for string, para aqui
    if (!id || typeof id !== 'string') {
        res.status(400).json({ error: "ID inválido" })
        return
    }
    
    try {
        const existing = await getTaskById(id)

        if (!existing) {
            res.status(404).json({ error: "Tarefa não encontrada" })
            return
        }

        if (existing.completed) {
            res.status(400).json({ error: "Tarefa já está concluída" })
            return
        }

        const task = await completeTask(id)
        res.status(200).json(task)
    } catch {
        res.status(500).json({ error: "Erro interno ao concluir a tarefa" })
    }
}

export async function deleteTaskController(req: Request, res: Response) {
    const { id } = req.params

    // Se o id não existir ou não for string, para aqui
    if (!id || typeof id !== 'string') {
        res.status(400).json({ error: "ID inválido" })
        return
    }

    try {
        const existing = await getTaskById(id)

        if (!existing) {
            res.status(404).json({ error: "Tarefa não encontrada" })
            return
        }

        await deleteTask(id)
        res.status(204).send()
    } catch {
        res.status(500).json({ error: "Erro interno ao deletar a tarefa" })
    }
}