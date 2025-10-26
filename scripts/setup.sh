#!/bin/bash

# Portfolio Setup Script
set -e

echo "🚀 Setting up Portfolio React Application..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed."; exit 1; }

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Lambda dependencies
echo "📦 Installing Lambda dependencies..."
cd lambda/chatbot-api && npm install && cd ../..
cd lambda/portfolio-api && npm install && cd ../..

# Create environment file
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your API URL after backend deployment"
fi

echo "✅ Setup complete!"
echo "Next steps:"
echo "1. Deploy backend: npm run deploy:backend"
echo "2. Update .env.local with API URL"
echo "3. Start development: npm run dev"