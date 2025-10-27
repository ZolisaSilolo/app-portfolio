#!/bin/bash

# Install dependencies for portfolio deployment
set -e

echo "Installing dependencies..."

# Update system packages
apt-get update -y

# Install nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    apt-get install -y nginx
fi

# Install Node.js if not present (for any server-side needs)
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Create application directory
mkdir -p /var/www/html/portfolio

# Set proper permissions
chown -R www-data:www-data /var/www/html/portfolio

echo "Dependencies installed successfully"
