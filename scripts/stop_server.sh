#!/bin/bash

# Stop nginx server gracefully
set -e

echo "Stopping nginx server..."

# Check if nginx is running
if systemctl is-active --quiet nginx; then
    echo "Stopping nginx..."
    systemctl stop nginx
else
    echo "Nginx is not running"
fi

echo "Server stopped successfully"
