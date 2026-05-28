# Multi-stage build: Node for monorepo, Python for API
FROM python:3.11-slim

WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install Python dependencies
WORKDIR /app/AIwithAbhi/apps/api
RUN python -m pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8000

# Start the API
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
