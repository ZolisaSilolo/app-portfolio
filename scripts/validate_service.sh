#!/bin/bash

# Validate that the portfolio application is running correctly
set -e

echo "Validating service..."

# Wait for nginx to start
sleep 5

# Check if nginx is running
if ! systemctl is-active --quiet nginx; then
    echo "❌ Nginx is not running"
    exit 1
fi

echo "✅ Nginx is running"

# Check if the application is accessible
if curl -f -s http://localhost/ > /dev/null; then
    echo "✅ Application is accessible"
else
    echo "❌ Application is not accessible"
    exit 1
fi

# Check if index.html exists
if [ -f "/var/www/html/portfolio/index.html" ]; then
    echo "✅ Application files deployed"
else
    echo "❌ Application files not found"
    exit 1
fi

echo "🎉 Service validation completed successfully"
