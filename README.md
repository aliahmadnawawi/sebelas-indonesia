# sebelasindonesia

Production-grade multi-tenant SaaS for storefront + messaging commerce.

## Structure
- `apps/api` NestJS API
- `apps/web` Next.js storefront + tenant dashboard
- `apps/admin` Next.js superadmin
- `packages/shared` shared types/utils
- `infra/nginx` Nginx reverse proxy
- `infra/scripts` deploy/ssl/backup

## Local run
1) `cp .env.example .env`
2) `docker compose up --build`

## Production deploy (VPS)
1) Copy `.env.example` to `.env` and fill values
2) Point DNS A records to the VPS
3) Run `./infra/scripts/init_wildcard_ssl.sh`
4) Run `./infra/scripts/deploy.sh`

## DNS setup
- `A @ -> 165.22.246.94`
- `A api -> 165.22.246.94`
- `A admin -> 165.22.246.94`
- `A * -> 165.22.246.94`

## SSL wildcard setup
Use `ACME_DNS_PROVIDER` and `ACME_DNS_ENV` to issue `*.sebelasindonesia.app` via DNS-01.

## Troubleshooting
- Confirm certs exist in `infra/nginx/certs`
- Check Nginx logs in the `sebelas-nginx` container
