FROM node:22-alpine AS frontend-build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

ARG SENTRY_AUTH_FRONTEND
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_FRONTEND}

COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY frontend /app/frontend

WORKDIR /app/frontend
RUN pnpm run build

FROM node:22-alpine AS backend-build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

ARG SENTRY_AUTH_BACKEND
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_BACKEND}

COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY backend /app/backend

COPY --from=frontend-build /app/frontend/dist /app/backend/public

WORKDIR /app/backend
RUN pnpm run build

FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=backend-build /app/backend /app/backend

COPY --from=frontend-build /app/frontend/dist /app/backend/public

ENV NODE_ENV=production
ENV URL URL
ENV REDIS_URL REDIS_URL
ENV REDIS_PORT REDIS_PORT

EXPOSE 4000

CMD ["pnpm", "NODE_ENV=production", "backend:prod"]