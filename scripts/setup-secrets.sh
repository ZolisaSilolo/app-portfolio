#!/bin/bash

# Setup AWS Secrets Manager for Cohere API Key
# This script securely stores the Cohere API key in AWS Secrets Manager

set -e

echo "🔐 Setting up AWS Secrets Manager for Cohere API Key..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is authenticated
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI is configured"

# Create the secret in AWS Secrets Manager
SECRET_NAME="portfolio-cohere-api-key"
COHERE_API_KEY="OvYluSE9btEKriIFiKWuIHJMmeFhQAo0evqSwXiG"

echo "📝 Creating secret in AWS Secrets Manager..."

# Create or update the secret
aws secretsmanager create-secret \
    --name "$SECRET_NAME" \
    --description "Cohere API key for portfolio chatbot" \
    --secret-string "{\"COHERE_API_KEY\":\"$COHERE_API_KEY\"}" \
    --region us-east-1 \
    2>/dev/null || \
aws secretsmanager update-secret \
    --secret-id "$SECRET_NAME" \
    --secret-string "{\"COHERE_API_KEY\":\"$COHERE_API_KEY\"}" \
    --region us-east-1

echo "✅ Secret created/updated successfully!"
echo "🔒 Secret Name: $SECRET_NAME"
echo "🌍 Region: us-east-1"

# Create IAM policy for Lambda to access the secret
echo "📋 Creating IAM policy for Lambda access..."

POLICY_NAME="PortfolioCohereSecretAccess"
POLICY_DOCUMENT='{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue"
            ],
            "Resource": "arn:aws:secretsmanager:us-east-1:*:secret:portfolio-cohere-api-key*"
        }
    ]
}'

# Create the policy
aws iam create-policy \
    --policy-name "$POLICY_NAME" \
    --policy-document "$POLICY_DOCUMENT" \
    --description "Allow Lambda functions to access Cohere API key secret" \
    2>/dev/null || echo "Policy already exists"

echo "✅ IAM policy created/updated successfully!"
echo "📋 Policy Name: $POLICY_NAME"

echo ""
echo "🎉 Setup complete! Your Cohere API key is now securely stored in AWS Secrets Manager."
echo ""
echo "Next steps:"
echo "1. Deploy the backend: npm run deploy:backend"
echo "2. Deploy to Amplify with the environment variables"
echo ""
echo "⚠️  IMPORTANT: The API key has been removed from this script for security."