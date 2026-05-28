#!/bin/bash
set -e

# Install Python dependencies at runtime (when Python is available)
python3 -m pip install -r requirements.txt --quiet

# Start the API server
python -m uvicorn main:app --host 0.0.0.0 --port $PORT
