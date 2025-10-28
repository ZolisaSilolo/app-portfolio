#!/bin/bash

# Portfolio Deployment Script with Session Management
set -e

echo "🚀 Deploying Portfolio with Session Management..."

# Check prerequisites
command -v aws >/dev/null 2>&1 || { echo "❌ AWS CLI required"; exit 1; }
command -v sam >/dev/null 2>&1 || { echo "❌ SAM CLI required"; exit 1; }

echo "✅ Prerequisites check passed"

# Build SAM application
echo "📦 Building SAM application..."
cd /mnt/e/app-portfilio
sam build -t deployment/template.yaml

# Deploy backend with session management
echo "☁️ Deploying backend with DynamoDB session management..."
sam deploy \
  --template-file deployment/template.yaml \
  --stack-name portfolio-backend \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides Environment=prod \
  --confirm-changeset

# Get API URL
API_URL=$(aws cloudformation describe-stacks \
  --stack-name portfolio-backend \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
  --output text)

echo "✅ Backend with session management deployed!"
echo "📋 API Gateway URL: $API_URL"
echo ""
echo "📊 DynamoDB Tables Created:"
echo "   - Sessions table for session persistence"
echo "   - Analytics table for user behavior tracking"
echo ""
echo "📝 Session Management Endpoints:"
echo "   - POST $API_URL/session/create"
echo "   - GET $API_URL/session/validate"
echo "   - POST $API_URL/session/analytics"
echo "   - DELETE $API_URL/session/logout"
echo ""
echo "📝 Next steps:"
echo "1. Update .env: VITE_API_BASE_URL=$API_URL"
echo "2. Deploy frontend to use new session management"
echo "3. Test authentication persistence"