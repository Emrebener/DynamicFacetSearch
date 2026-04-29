#!/usr/bin/env bash
set -euo pipefail

echo "Deploying Flexible Product Catalogue to the OCI test environment."

docker compose up -d --build
docker compose ps

docker image prune -f

echo "Deployment complete. This is a test/demo environment, not production."

