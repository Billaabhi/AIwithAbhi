#!/bin/bash
if [ -d "apps/api" ]; then
  cd apps/api
elif [ -d "AIwithAbhi/apps/api" ]; then
  cd AIwithAbhi/apps/api
fi
exec uvicorn main:app --host 0.0.0.0 --port $PORT
