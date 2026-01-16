# Sebelas Indonesia

```
┌─────────────────────────────────────────────────────────┐
│ Sebelas Indonesia                                       │
│ Modern SaaS multi-store & bot commerce platform         │
└─────────────────────────────────────────────────────────┘
```

Modern SaaS multi-store & bot commerce platform.

## Architecture
- Web: Next.js storefront + tenant dashboard
- Admin: Next.js superadmin console
- API: NestJS + Prisma + PostgreSQL
- Telegram: Webhook-based multi-bot commerce
- WhatsApp: Cloud API webhook integration
- Payments: Provider plugins + QRIS

## QRIS Support
Providers with QRIS-ready flow:
- Tripay
- Pakasir
- Saweria

## Tech Stack
- Backend: NestJS, Prisma, PostgreSQL, Redis, BullMQ
- Frontend: Next.js, Tailwind CSS
- Infra: Docker Compose, Nginx, acme.sh wildcard SSL

## Local Development (Docker)
1) `cp .env.example .env`
2) `docker compose up --build`

Dev seed credentials (dev-only):
- Superadmin: `superadmin@sebelasindonesia.app` / `superadmin123`
- Demo owner: `demo@sebelasindonesia.app` / `demo12345`

## Production (VPS)
1) `git pull`
2) Copy `.env.example` to `.env` and fill values
3) Point DNS A records to the VPS
4) Run `./infra/scripts/init_wildcard_ssl.sh`
5) Start dependencies: `docker compose up -d postgres redis`
6) Run migrations + seed on VPS:
   - `npm install`
   - `npm --workspace apps/api run prisma:deploy`
   - `npm --workspace apps/api run prisma:seed`
7) Deploy services: `./infra/scripts/deploy.sh`

## Environment Variables (no secrets)
Key variables to configure:
- `APP_URL`, `API_URL`, `ADMIN_URL`
- `DATABASE_URL`, `REDIS_URL`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `TELEGRAM_WEBHOOK_SECRET`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SUPPORT_WHATSAPP`, `NEXT_PUBLIC_SUPPORT_TELEGRAM`

See `.env.example` for the full list.

## Integrations

### Telegram Bot
1) Create bot via BotFather
2) Set webhook: `https://api.sebelasindonesia.app/telegram/webhook/<botToken>`
3) Set secret header: `X-Telegram-Bot-Api-Secret-Token` = `TELEGRAM_WEBHOOK_SECRET`

### WhatsApp Cloud API
1) Create Meta app and enable WhatsApp product
2) Get `phone_number_id`, `waba_id`, `access_token`
3) Set webhook: `https://api.sebelasindonesia.app/whatsapp/webhook`
4) Verify token must match store channel `webhookVerifyToken`

## Go-Live Checklist
- DNS A records point to VPS (root, api, admin, wildcard)
- Wildcard SSL issued and in `infra/nginx/certs`
- `.env` configured with production values
- Postgres + Redis running
- Prisma migrations + seed completed on VPS
- `docker compose up -d --build` finished successfully
- Telegram webhook registered with secret header
- WhatsApp webhook verified in Meta App
- QRIS provider configured per store

## URLs
- https://sebelasindonesia.app/
- https://sebelasindonesia.app/sebelas
- https://admin.sebelasindonesia.app/
- Telegram webhook: `https://api.sebelasindonesia.app/telegram/webhook/<botToken>`
- WhatsApp webhook: `https://api.sebelasindonesia.app/whatsapp/webhook`
