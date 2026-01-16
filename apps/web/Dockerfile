FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm ci || npm install

FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules /app/node_modules
RUN npm run build:web

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/apps/web/.next /app/.next
COPY --from=builder /app/apps/web/public /app/public
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/web/package.json /app/package.json
EXPOSE 3000
CMD ["npm", "run", "start:web"]
