# Appeal Workflow API

Backend API for a role-based appeal workflow management system.

## Features

- JWT authentication
- Role-based access control (RBAC)
- Appeal lifecycle management
- Workflow transition validation
- Verifier review workflow
- Registrar review queue
- Service-layer architecture
- Zod validation
- Prisma ORM integration

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod

## Workflow Lifecycle

```text
UNDER_VERIFICATION
→ WITH_REGISTRAR
→ UNDER_HEARING
→ CLOSED
```

Additional transitions:

- WITH_REGISTRAR → REVERTED_TO_APPELLANT
- REVERTED_TO_APPELLANT → UNDER_VERIFICATION

## Project Structure

```text
controllers/
services/
routes/
validators/
middlewares/
utils/
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL=
JWT_SECRET=
```
