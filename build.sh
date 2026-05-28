#!/bin/bash
set -e

echo "==> Building AIwithAbhi API"

# Copy prompts from ../../packages/prompts to ./prompts
cp -r ../../../packages/prompts ./prompts 2>/dev/null || true

echo "==> Build complete"
