import { prisma } from "../../lib/prisma.js"

interface CreateTaskInput {
    title: string
    description?: string | null
}

interface UpdateTaskInput {
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

export async function getAllTasks() {
    return await prisma.task.findMany({
        orderBy: { createdAt: "desc" },
    })
}

export async function getTaskById(id: string) {
    return await prisma.task.findUnique({
        where: { id },
    })
}

export async function updateTask(id: string, data: UpdateTaskInput) {
    return await prisma.task.update({
        where: { id },
        data: {
            title: data.title.trim(),
            description: data.description ?? null,
        },
    })
}

export async function completeTask(id: string) {
    return await prisma.task.update({
        where: { id },
        data: { completed: true },
    })
}

export async function deleteTask(id: string) {
    return await prisma.task.delete({
        where: { id },
    })
}