import { prisma } from "../../lib/prisma.js"

interface CreateTaskInput {
    title: string
    description?: string | null
}

export async function createTask(data: CreateTaskInput) {
    return await prisma.task.create({
        data: {
            title: data.title.trim(),
            description: data.description ?? null,
            completed: false,
        },
    })
}