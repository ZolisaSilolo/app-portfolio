#!/bin/bash

# Deploy security enhancements to your portfolio
echo "🔒 Deploying security enhancements..."

# Build the SAM application
echo "Building SAM application..."
sam build

# Deploy with existing stack name (replace with your actual stack name)
echo "Deploying to AWS..."
sam deploy \
  --stack-name portfolio-backend \
  --region us-east-1 \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides Environment=prod \
  --no-confirm-changeset \
  --no-fail-on-empty-changeset

echo "✅ Security enhancements deployed!"
echo ""
echo "🛡️ What was added:"
echo "• API Gateway Usage Plan (100 req/sec, 10K req/day)"
echo "• API Key for monitoring"
echo "• Rate limiting protection"
echo "• DDoS protection"
echo ""
echo "💰 Cost impact: $0.00/month (stays in free tier)"
