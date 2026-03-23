import { describe, it, expect, vi, beforeEach } from "vitest"
import request from "supertest"
import app from "../app.js"

const { mockCreate } = vi.hoisted(() => ({
    mockCreate: vi.fn(),
}))

vi.mock("../../lib/prisma.js", () => ({
    prisma: {
        task: {
            create: mockCreate,
        },
    },
}))

describe("POST /tasks", () => {
    beforeEach(() => {
        mockCreate.mockReset()
    })

    it("deve criar uma tarefa e retornar status 201", async () => {
        mockCreate.mockResolvedValue({
            id: "uuid-fake-123",
            title: "Comprar pão",
            description: "Ir à padaria antes das 9h",
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const response = await request(app)
            .post("/tasks")
            .send({ title: "Comprar pão", description: "Ir à padaria antes das 9h" })

        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({
            title: "Comprar pão",
            description: "Ir à padaria antes das 9h",
            completed: false,
        })
        expect(response.body.id).toBeDefined()
    })

    it("deve retornar 400 se o título não for enviado", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ description: "Sem título" })

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({
            error: "O título é obrigatório",
        })
    })

    it("deve retornar 400 se o título estiver vazio", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: "" })

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({
            error: "O título é obrigatório",
        })
    })

    it("deve criar uma tarefa sem descrição", async () => {
        mockCreate.mockResolvedValue({
            id: "uuid-fake-456",
            title: "Ir ao mercado",
            description: null,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const response = await request(app)
            .post("/tasks")
            .send({ title: "Ir ao mercado" })

        expect(response.status).toBe(201)
        expect(response.body.title).toBe("Ir ao mercado")
        expect(response.body.description).toBeNull()
    })

    it("deve ignorar o campo completed enviado pelo cliente", async () => {
        mockCreate.mockResolvedValue({
            id: "uuid-fake-789",
            title: "Pagar conta de luz",
            description: null,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const response = await request(app)
            .post("/tasks")
            .send({ title: "Pagar conta de luz", completed: true })

        expect(response.status).toBe(201)
        expect(response.body.completed).toBe(false)
    })
})