#!/bin/bash
set -e

echo "==> Starting AIwithAbhi API"

# We're already in AIwithAbhi/apps/api due to Root Directory setting
uvicorn main:app --host 0.0.0.0 --port 8000
