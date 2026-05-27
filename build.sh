#!/bin/bash
set -e

echo "==> Building AIwithAbhi API"

# We're already in AIwithAbhi/apps/api due to Root Directory setting
# Copy prompts from ../../packages/prompts to ./prompts
cp -r ../../../packages/prompts ./prompts 2>/dev/null || true

# Install Python dependencies
pip install -r requirements.txt

echo "==> Build complete"
