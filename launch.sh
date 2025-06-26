#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

PID_FILE=".server.pid"

if [ -f $PID_FILE ] && ps -p $(cat $PID_FILE) > /dev/null; then
    echo "Server is already running."
else
    echo "Starting server..."
    python server.py &
    echo $! > $PID_FILE
fi

xdg-open http://localhost:8000
