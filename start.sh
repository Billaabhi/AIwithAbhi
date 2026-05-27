#!/bin/bash
cd AIwithAbhi/apps/api
exec uvicorn main:app --host 0.0.0.0 --port $PORT
