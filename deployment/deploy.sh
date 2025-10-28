#!/bin/bash

# Portfolio Deployment Script
set -e

echo "🚀 Deploying Portfolio Application..."

# Check prerequisites
command -v aws >/dev/null 2>&1 || { echo "❌ AWS CLI required"; exit 1; }
command -v sam >/dev/null 2>&1 || { echo "❌ SAM CLI required"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js required"; exit 1; }

echo "✅ Prerequisites check passed"

# Install and build
echo "📦 Installing dependencies..."
npm install

echo "🔨 Building application..."
npm run build

# Deploy backend
echo "☁️ Deploying backend..."
npm run deploy:backend

# Get API URL
STACK_NAME=${1:-portfolio-backend}
API_URL=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query "Stacks[0].Outputs[?OutputKey==\`PortfolioApiUrl\`].OutputValue" --output text 2>/dev/null || echo "")

if [ -n "$API_URL" ]; then
    echo "✅ Backend deployed: $API_URL"
    echo "VITE_API_BASE_URL=$API_URL" > .env.production
else
    echo "⚠️  Could not retrieve API URL. Please check CloudFormation stack."
fi

echo "🎉 Deployment complete!"
echo "Next: Configure Amplify with your Git repository"