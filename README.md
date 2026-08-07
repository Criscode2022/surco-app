# SURCO

Cuaderno digital de **explotación familiar**: parcelas y tareas de campo con roles **FARMER** y **TECHNICIAN**.

> El campo, al día.

## Stack

Angular · NestJS · Prisma · Neon Postgres · Tailwind · JWT

## Arranque local

```bash
cp apps/api/.env.example apps/api/.env   # DATABASE_URL, JWT_SECRET, PORT=3007
npm install --prefix apps/api
npm install --prefix apps/web
npm --prefix apps/api run prisma:migrate
npm --prefix apps/api run prisma:seed
npm run api   # http://localhost:3007
npm run web   # http://localhost:4200
```

## Demo

| Rol | Email | Password |
|-----|-------|----------|
| Agricultor | campo@surco.agro | password123 |
| Técnico | tecnico@surco.agro | password123 |

## API (smoke)

- `POST /api/auth/login` → `{ accessToken, user }`
- `GET /api/tasks` · `GET /api/tasks/stats/summary`
- `POST /api/tasks` (FARMER) · `PATCH /api/tasks/:id/status`

## Case / diseño

- Case: `ux-projects/2026-08-07-surco/`
- Paper: https://app.paper.design/file/01KZDGF3509TA4WDZTTQJW1V45
- Neon: old-paper-48739086

## Licencia

Proyecto de portfolio del cron diario UX/UI.
