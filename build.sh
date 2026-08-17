#!/bin/bash
set -e

cd "$(dirname "$0")"

pip3 install -q jinja2 markdown pyyaml

python3 build.py

echo "Done. Run 'docker compose up' to serve at http://localhost:8080"
