#!/bin/bash
# start_rag.sh - Persistently starts the Agile Healthcare RAG Service
# Usage: ./start_rag.sh

# Determine the absolute path of the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/../.." && pwd )"

VENV_PATH="$PROJECT_DIR/.venv_stable"
LOG_FILE="$PROJECT_DIR/rag_server.log"

cd "$PROJECT_DIR"

# Kill existing uvicorn processes on port 8001
pkill -f "uvicorn.*8001" || true

# Start uvicorn in the background using nohup
echo "Starting Agile Healthcare RAG Service on port 8001..."
nohup "$VENV_PATH/bin/python3" -m uvicorn app.main:app --host 0.0.0.0 --port 8001 > "$LOG_FILE" 2>&1 &

echo "Server started in background. Logs are being written to $LOG_FILE"
echo "PID: $!"
