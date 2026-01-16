#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "${ROOT_DIR}"

if [[ ! -f ".env" ]]; then
  echo ".env not found. Copy .env.example to .env and fill values."
  exit 1
fi

docker compose pull
docker compose build
docker compose up -d

echo "Deployment complete."
