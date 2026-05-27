#!/bin/bash
set -e

echo "==> Starting AIwithAbhi API"

cd AIwithAbhi/apps/api
uvicorn main:app --host 0.0.0.0 --port 8000
