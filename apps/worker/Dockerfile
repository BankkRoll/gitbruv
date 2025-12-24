FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g bun

COPY package.json bun.lock ./
COPY apps/worker/package.json ./apps/worker/
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/

RUN bun install --frozen-lockfile

COPY packages ./packages
COPY apps/worker ./apps/worker

WORKDIR /app/apps/worker
RUN bun run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/worker/dist ./apps/worker/dist
COPY --from=builder /app/apps/worker/package.json ./apps/worker/
COPY --from=builder /app/apps/worker/node_modules ./apps/worker/node_modules

WORKDIR /app/apps/worker

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/server.js"]
