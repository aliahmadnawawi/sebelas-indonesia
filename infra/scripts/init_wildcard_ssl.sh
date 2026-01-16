#!/usr/bin/env bash
set -euo pipefail

DOMAIN="sebelasindonesia.app"
CERT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../nginx/certs" && pwd)"

if [[ -z "${ACME_DNS_PROVIDER:-}" ]]; then
  echo "ACME_DNS_PROVIDER is required (e.g. dns_cf)."
  exit 1
fi

if [[ -z "${ACME_DNS_ENV:-}" ]]; then
  echo "ACME_DNS_ENV is required (provider-specific env vars)."
  exit 1
fi

echo "Using ACME DNS provider: ${ACME_DNS_PROVIDER}"
echo "Using ACME DNS env: ${ACME_DNS_ENV}"

if ! command -v acme.sh >/dev/null 2>&1; then
  echo "Installing acme.sh..."
  curl https://get.acme.sh | sh
fi

source "$HOME/.acme.sh/acme.sh.env"

eval "${ACME_DNS_ENV}"

~/.acme.sh/acme.sh --issue \
  --dns "${ACME_DNS_PROVIDER}" \
  -d "${DOMAIN}" -d "*.${DOMAIN}" \
  --keylength ec-256

mkdir -p "${CERT_DIR}"

~/.acme.sh/acme.sh --install-cert -d "${DOMAIN}" \
  --key-file "${CERT_DIR}/${DOMAIN}.key" \
  --fullchain-file "${CERT_DIR}/fullchain.cer" \
  --reloadcmd "docker compose -f $(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/docker-compose.yml restart nginx"

echo "Wildcard certificate installed to ${CERT_DIR}"
