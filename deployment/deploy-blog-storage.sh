#!/bin/bash

set -e

echo "🚀 Deploying Blog Storage Infrastructure..."

# Get Cognito User Pool ID
USER_POOL_ID=$(aws cloudformation describe-stacks \
  --stack-name portfolio-cognito \
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' \
  --output text)

if [ -z "$USER_POOL_ID" ]; then
  echo "❌ Error: Could not find Cognito User Pool ID"
  exit 1
fi

echo "📋 Using Cognito User Pool: $USER_POOL_ID"

# Deploy SAM template
echo "📦 Deploying SAM template..."
sam deploy \
  --template-file deployment/blog-storage.yaml \
  --stack-name portfolio-blog-storage \
  --parameter-overrides CognitoUserPoolId=$USER_POOL_ID \
  --capabilities CAPABILITY_IAM \
  --no-fail-on-empty-changeset

# Get outputs
BLOG_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name portfolio-blog-storage \
  --query 'Stacks[0].Outputs[?OutputKey==`BlogBucketName`].OutputValue' \
  --output text)

API_URL=$(aws cloudformation describe-stacks \
  --stack-name portfolio-blog-storage \
  --query 'Stacks[0].Outputs[?OutputKey==`BlogAdminApiUrl`].OutputValue' \
  --output text)

echo "✅ Blog Storage Infrastructure deployed successfully!"
echo ""
echo "📋 Configuration:"
echo "Blog Bucket: $BLOG_BUCKET"
echo "API URL: $API_URL"
echo ""
echo "📝 Next steps:"
echo "1. Add VITE_BLOG_API_URL=$API_URL to your .env file"
echo "2. Rebuild your frontend: npm run build"
echo "3. Deploy to Amplify"
