#!/bin/bash
set -e

cd "$(dirname "$0")"

npm install
npm run build

echo "Done. Run 'docker compose up' to serve at http://localhost:8181"
