FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm ci || npm install

FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules /app/node_modules
RUN npm run build:api

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/apps/api/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/api/package.json /app/package.json
EXPOSE 3000
CMD ["node", "dist/main.js"]
