FROM oven/bun:latest AS frontend-build

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends unzip && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lockb ./
COPY frontend /app/frontend

ARG SENTRY_AUTH_FRONTEND
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_FRONTEND}

RUN bun install --frozen-lockfile --cwd /app/frontend
RUN cd frontend && bun run build

FROM node:22 AS backend-build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8 --activate

COPY backend /app/backend
COPY --from=frontend-build /app/frontend/dist /app/backend/public

WORKDIR /app/backend

ARG SENTRY_AUTH_BACKEND
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_BACKEND}

RUN pnpm install && pnpm run build

FROM oven/bun:latest

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends unzip && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lockb ./
COPY --from=backend-build /app/backend /app/backend
COPY --from=frontend-build /app/frontend/dist /app/backend/public
COPY frontend /app/frontend

RUN rm -rf /app/frontend/node_modules /app/backend/node_modules /root/.cache /root/.npm

RUN bun install --frozen-lockfile --prod --cwd /app/frontend
RUN bun install --frozen-lockfile --prod --cwd /app/backend

ENV DATABASE_URL=${DATABASE_URL}
RUN cd /app/backend && bun run prisma:generate

ENV NODE_ENV=production
ENV URL=${URL}
ENV REDIS_HOST=${REDIS_HOST}
ENV REDIS_USERNAME=${REDIS_USERNAME}
ENV REDIS_PASSWORD=${REDIS_PASSWORD}
ENV REDIS_PORT=${REDIS_PORT}

EXPOSE 4000

CMD cd /app/backend && bun run start:prod
