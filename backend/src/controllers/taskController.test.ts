import { describe, it, expect, vi, beforeEach } from "vitest"
import request from "supertest"
import app from "../app.js"

const { mockCreate, mockFindMany, mockFindUnique, mockUpdate, mockDelete } = vi.hoisted(() => ({
    mockCreate: vi.fn(),
    mockFindMany: vi.fn(),
    mockFindUnique: vi.fn(),
    mockUpdate: vi.fn(),
    mockDelete: vi.fn(),
}))

vi.mock("../../lib/prisma.js", () => ({
    prisma: {
        task: {
            create: mockCreate,
            findMany: mockFindMany,
            findUnique: mockFindUnique,
            update: mockUpdate,
            delete: mockDelete,
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

describe("GET /tasks", () => {
    beforeEach(() => {
        mockFindMany.mockReset()
    })

    it("deve retornar uma lista de tarefas com status 200", async () => {
        mockFindMany.mockResolvedValue([
            {
                id: "uuid-fake-001",
                title: "Comprar pão",
                description: "Ir à padaria antes das 9h",
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: "uuid-fake-002",
                title: "Pagar conta de luz",
                description: null,
                completed: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ])

        const response = await request(app).get("/tasks")

        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(2)
        expect(response.body[0]).toMatchObject({
            title: "Comprar pão",
            completed: false,
        })
        expect(response.body[1]).toMatchObject({
            title: "Pagar conta de luz",
            completed: true,
        })
    })

    it("deve retornar uma lista vazia se não houver tarefas", async () => {
        mockFindMany.mockResolvedValue([])

        const response = await request(app).get("/tasks")

        expect(response.status).toBe(200)
        expect(response.body).toEqual([])
    })

    it("deve retornar 500 se o banco falhar", async () => {
        mockFindMany.mockRejectedValue(new Error("DB error"))

        const response = await request(app).get("/tasks")

        expect(response.status).toBe(500)
    })
})

describe("GET /tasks/:id", () => {
    beforeEach(() => {
        mockFindUnique.mockReset()
    })

    it("deve retornar uma tarefa pelo id com status 200", async () => {
        mockFindUnique.mockResolvedValue({
            id: "uuid-fake-001",
            title: "Comprar pão",
            description: "Ir à padaria antes das 9h",
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const response = await request(app).get("/tasks/uuid-fake-001")

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            id: "uuid-fake-001",
            title: "Comprar pão",
            description: "Ir à padaria antes das 9h",
            completed: false,
        })
    })

    it("deve retornar 404 se a tarefa não existir", async () => {
        mockFindUnique.mockResolvedValue(null)

        const response = await request(app).get("/tasks/id-que-nao-existe")

        expect(response.status).toBe(404)
        expect(response.body).toMatchObject({
            error: "Tarefa não encontrada",
        })
    })

    it("deve retornar 500 se o banco falhar", async () => {
        mockFindUnique.mockRejectedValue(new Error("DB error"))

        const response = await request(app).get("/tasks/uuid-fake-001")

        expect(response.status).toBe(500)
    })
})

describe("PUT /tasks/:id", () => {
    beforeEach(() => {
        mockFindUnique.mockReset()
        mockUpdate.mockReset()
    })

    it("deve atualizar uma tarefa e retornar status 200", async () => {
        mockFindUnique.mockResolvedValue({
            id: "uuid-fake-001",
            title: "Comprar pão",
            description: null,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        mockUpdate.mockResolvedValue({
            id: "uuid-fake-001",
            title: "Comprar pão e leite",
            description: "Ir à padaria cedo",
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const response = await request(app)
            .put("/tasks/uuid-fake-001")
            .send({ title: "Comprar pão e leite", description: "Ir à padaria cedo" })

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            id: "uuid-fake-001",
            title: "Comprar pão e leite",
            description: "Ir à padaria cedo",
        })
    })

    it("deve retornar 400 se o título não for enviado", async () => {
        const response = await request(app)
            .put("/tasks/uuid-fake-001")
            .send({ description: "Sem título" })

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({
            error: "O título é obrigatório",
        })
    })

    it("deve retornar 400 se o título estiver vazio", async () => {
        const response = await request(app)
            .put("/tasks/uuid-fake-001")
            .send({ title: "" })

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({
            error: "O título é obrigatório",
        })
    })

    it("deve retornar 404 se a tarefa não existir", async () => {
        mockFindUnique.mockResolvedValue(null)

        const response = await request(app)
            .put("/tasks/id-que-nao-existe")
            .send({ title: "Novo título" })

        expect(response.status).toBe(404)
        expect(response.body).toMatchObject({
            error: "Tarefa não encontrada",
        })
    })

    it("deve retornar 500 se o banco falhar", async () => {
        mockFindUnique.mockRejectedValue(new Error("DB error"))

        const response = await request(app)
            .put("/tasks/uuid-fake-001")
            .send({ title: "Novo título" })

        expect(response.status).toBe(500)
    })
})

describe("PATCH /tasks/:id/complete", () => {
    beforeEach(() => {
        mockFindUnique.mockReset()
        mockUpdate.mockReset()
    })

    it("deve marcar uma tarefa como concluída e retornar status 200", async () => {
        mockFindUnique.mockResolvedValue({
            id: "uuid-fake-001",
            title: "Comprar pão",
            description: null,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        mockUpdate.mockResolvedValue({
            id: "uuid-fake-001",
            title: "Comprar pão",
            description: null,
            completed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const response = await request(app).patch("/tasks/uuid-fake-001/complete")

        expect(response.status).toBe(200)
        expect(response.body.completed).toBe(true)
    })

    it("deve retornar 404 se a tarefa não existir", async () => {
        mockFindUnique.mockResolvedValue(null)

        const response = await request(app).patch("/tasks/id-que-nao-existe/complete")

        expect(response.status).toBe(404)
        expect(response.body).toMatchObject({
            error: "Tarefa não encontrada",
        })
    })

    it("deve retornar 400 se a tarefa já estiver concluída", async () => {
        mockFindUnique.mockResolvedValue({
            id: "uuid-fake-001",
            title: "Comprar pão",
            description: null,
            completed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const response = await request(app).patch("/tasks/uuid-fake-001/complete")

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({
            error: "Tarefa já está concluída",
        })
    })

    it("deve retornar 500 se o banco falhar", async () => {
        mockFindUnique.mockRejectedValue(new Error("DB error"))

        const response = await request(app).patch("/tasks/uuid-fake-001/complete")

        expect(response.status).toBe(500)
    })
})

describe("DELETE /tasks/:id", () => {
    beforeEach(() => {
        mockFindUnique.mockReset()
        mockDelete.mockReset()
    })

    it("deve deletar uma tarefa e retornar status 204", async () => {
        mockFindUnique.mockResolvedValue({
            id: "uuid-fake-001",
            title: "Comprar pão",
            description: null,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        mockDelete.mockResolvedValue({})

        const response = await request(app).delete("/tasks/uuid-fake-001")

        expect(response.status).toBe(204)
        expect(response.body).toEqual({})
    })

    it("deve retornar 404 se a tarefa não existir", async () => {
        mockFindUnique.mockResolvedValue(null)

        const response = await request(app).delete("/tasks/id-que-nao-existe")

        expect(response.status).toBe(404)
        expect(response.body).toMatchObject({
            error: "Tarefa não encontrada",
        })
    })

    it("deve retornar 500 se o banco falhar", async () => {
        mockFindUnique.mockRejectedValue(new Error("DB error"))

        const response = await request(app).delete("/tasks/uuid-fake-001")

        expect(response.status).toBe(500)
    })
})