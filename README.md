# 🗂️ taskflow

> Aplicação fullstack de gerenciamento de tarefas construída para praticar desenvolvimento moderno com TypeScript, Prisma, Docker, PostgreSQL e GitHub Actions — desenvolvida com TDD usando Vitest.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker_Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![CI](https://img.shields.io/github/actions/workflow/status/seu-usuario/taskflow/ci.yml?style=flat-square&label=CI&logo=githubactions&logoColor=white)

---

## 📌 Sobre o projeto

O **taskflow** é um projeto de estudos pessoais para consolidar conhecimentos em ferramentas e práticas modernas de desenvolvimento. Possui um backend em Express com arquitetura MVC e um frontend em Next.js, tudo orquestrado via Docker Compose.

### 🎯 Tecnologias praticadas

| Tecnologia | Finalidade |
|---|---|
| **TypeScript** | Tipagem estática em todo o projeto |
| **Express** | API REST no backend com padrão MVC |
| **Next.js** | Interface web no frontend |
| **Prisma ORM** | Modelagem e acesso ao banco de dados |
| **PostgreSQL** | Banco de dados relacional |
| **Docker + Compose** | Containerização de todos os serviços |
| **Vitest** | Testes com metodologia TDD |
| **GitHub Actions** | CI automatizado |

---

## 📁 Estrutura do projeto

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── models/         # Modelos e acesso ao banco via Prisma
│   │   ├── controllers/    # Lógica das requisições
│   │   ├── routes/         # Definição das rotas Express
│   │   └── server.ts       # Entry point da aplicação
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── app/            # Rotas e páginas (Next.js App Router)
│   │   └── components/     # Componentes reutilizáveis
│   └── ...
├── docker-compose.yml
└── README.md
```

---

## 🚀 Como rodar com Docker Compose

> **Pré-requisitos:** ter [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados.

**1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/taskflow.git
cd taskflow
```

**2. Configure as variáveis de ambiente**

```bash
cp backend/.env.example backend/.env
```

O `.env` padrão já vem pronto para o Docker:

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/taskflow"
PORT=5000
NODE_ENV=development
```

> ⚠️ O host `db` no `DATABASE_URL` é o nome do serviço do PostgreSQL no `docker-compose.yml`. Não troque por `localhost` ao rodar via Docker.

**3. Suba todos os serviços**

```bash
docker compose up --build
```

Esse comando irá subir o **banco de dados**, rodar as **migrations** automaticamente, iniciar o **backend** na porta `5000` e o **frontend** na porta `3000`.

**4. Acesse a aplicação**

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:5000 |

**5. Parar os containers**

```bash
# Apenas parar
docker compose down

# Parar e apagar os dados do banco
docker compose down -v
```

---

## 🔁 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/tasks` | Lista todas as tarefas |
| `GET` | `/tasks/:id` | Busca uma tarefa por ID |
| `POST` | `/tasks` | Cria uma nova tarefa |
| `PUT` | `/tasks/:id` | Atualiza uma tarefa |
| `DELETE` | `/tasks/:id` | Remove uma tarefa |

---

## 🧪 Rodando os testes

```bash
# Via Docker
docker compose run --rm backend npm run test

# Localmente (dentro da pasta backend/)
npm run test

# Modo watch
npm run test:watch
```

---

## ⚙️ CI com GitHub Actions

A cada `push` ou `pull request` na branch `main`, o pipeline executa automaticamente a verificação de tipos com `tsc` e todos os testes do Vitest com um banco PostgreSQL temporário.

---

## 👤 Autor

Feito por **[Itiel Cardoso Dario](https://github.com/itieldario)**
