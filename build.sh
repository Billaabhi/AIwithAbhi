#!/bin/bash
set -e

echo "==> Building AIwithAbhi API"

# Copy prompts directory into api folder so it's included in deployment
cp -r packages/prompts AIwithAbhi/apps/api/prompts 2>/dev/null || true

# Install Python dependencies
cd AIwithAbhi/apps/api
pip install -r requirements.txt

echo "==> Build complete"
