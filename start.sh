#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for available server options
if command_exists npx; then
    echo "Starting server using Node.js http-server..."
    npx http-server . -p 8080 -c-1 --cors &
elif command_exists python3; then
    echo "Starting server using Python3..."
    python3 -m http.server 8080 &
elif command_exists python; then
    echo "Starting server using Python..."
    python -m http.server 8080 &
else
    echo "Error: No suitable server found. Please install Node.js or Python."
    exit 1
fi

# Store the server's PID
SERVER_PID=$!

# Wait for server to start
sleep 2

# Try to open the status page
if command_exists xdg-open; then
    xdg-open http://localhost:8080/status.html
elif command_exists open; then
    open http://localhost:8080/status.html
else
    echo "Please open http://localhost:8080/status.html in your browser"
fi

echo "Press Ctrl+C to stop the server"
wait $SERVER_PID
