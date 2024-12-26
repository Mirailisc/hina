FROM oven/bun:latest AS frontend-build

WORKDIR /app

COPY package.json bun.lockb ./
COPY frontend /app/frontend

RUN bun install --frozen-lockfile --cwd /app/frontend
WORKDIR /app/frontend
RUN bun run build

FROM node:22-alpine AS backend-build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY backend /app/backend
COPY --from=frontend-build /app/frontend/dist /app/backend/public

WORKDIR /app/backend
RUN pnpm install
RUN pnpm run build

FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
COPY --from=backend-build /app/backend /app/backend
COPY --from=frontend-build /app/frontend/dist /app/backend/public 
COPY frontend /app/frontend

RUN rm -rf /app/frontend/node_modules /app/backend/node_modules /root/.cache

RUN bun install --frozen-lockfile --cwd /app/frontend
RUN bun install --frozen-lockfile --cwd /app/backend

ENV NODE_ENV=production
ENV URL URL
ENV REDIS_HOST REDIS_HOST
ENV REDIS_USERNAME REDIS_USERNAME
ENV REDIS_PASSWORD REDIS_PASSWORD
ENV REDIS_PORT REDIS_PORT

EXPOSE 4000

CMD cd backend && bun run start:prod
