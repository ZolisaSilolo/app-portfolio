#!/bin/bash

# Deploy Admin Content Management System
echo "🚀 Deploying Admin Content Management System..."

# Set your admin password (change this!)
ADMIN_PASSWORD="ZolisaAdmin2025!"

# Build and deploy the admin Lambda function
echo "📦 Building admin Lambda function..."
sam build -t admin-template.yaml

echo "🚀 Deploying admin infrastructure..."
sam deploy \
  --template-file admin-template.yaml \
  --stack-name portfolio-admin \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides AdminPassword="$ADMIN_PASSWORD" \
  --confirm-changeset

# Get the API Gateway URL
ADMIN_API_URL=$(aws cloudformation describe-stacks \
  --stack-name portfolio-admin \
  --query 'Stacks[0].Outputs[?OutputKey==`AdminApiUrl`].OutputValue' \
  --output text)

echo "✅ Admin system deployed successfully!"
echo "📝 Admin API URL: $ADMIN_API_URL"
echo "🔐 Admin Password: $ADMIN_PASSWORD"
echo ""
echo "📋 Next steps:"
echo "1. Update your .env file with: REACT_APP_ADMIN_API_URL=$ADMIN_API_URL"
echo "2. Access admin panel at: https://your-domain.com/admin"
echo "3. Use password: $ADMIN_PASSWORD"
echo ""
echo "🔒 Security Notes:"
echo "- Change the admin password in the script and redeploy"
echo "- Consider implementing JWT authentication for production"
echo "- Monitor S3 bucket costs and set up lifecycle policies"
