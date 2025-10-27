#!/bin/bash

# AWS CI/CD Pipeline Setup Script (Fixed)
set -e

PROJECT_NAME="portfolio-react"
STACK_NAME="${PROJECT_NAME}-cicd-stack"
REGION="us-east-1"

echo "🚀 Setting up AWS CI/CD Pipeline for ${PROJECT_NAME} (Fixed Version)"

# Check AWS CLI configuration
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI configured"

# Clean up any existing failed stack
echo "🧹 Cleaning up any existing stack..."
aws cloudformation delete-stack --stack-name $STACK_NAME --region $REGION 2>/dev/null || true
aws cloudformation wait stack-delete-complete --stack-name $STACK_NAME --region $REGION 2>/dev/null || true

# Deploy CloudFormation stack with fixed template
echo "📦 Deploying CloudFormation stack..."
aws cloudformation deploy \
    --template-file aws-cicd-setup-fixed.yaml \
    --stack-name $STACK_NAME \
    --parameter-overrides ProjectName=$PROJECT_NAME \
    --capabilities CAPABILITY_IAM \
    --region $REGION

echo "✅ CloudFormation stack deployed"

# Get stack outputs
echo "📋 Getting stack outputs..."
CODECOMMIT_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`CodeCommitRepositoryCloneUrl`].OutputValue' \
    --output text)

CODEARTIFACT_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`CodeArtifactRepositoryEndpoint`].OutputValue' \
    --output text)

PIPELINE_NAME=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`CodePipelineName`].OutputValue' \
    --output text)

echo "✅ Stack outputs retrieved"

# Configure CodeArtifact for local development
echo "🔧 Configuring CodeArtifact for local development..."
CODEARTIFACT_TOKEN=$(aws codeartifact get-authorization-token \
    --domain ${PROJECT_NAME}-domain \
    --query authorizationToken \
    --output text \
    --region $REGION)

npm config set registry $CODEARTIFACT_ENDPOINT
npm config set "${CODEARTIFACT_ENDPOINT}:_authToken" $CODEARTIFACT_TOKEN

echo "✅ CodeArtifact configured for npm"

# Initialize git repository if not exists
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# Add CodeCommit as remote
echo "🔧 Adding CodeCommit remote..."
git remote remove origin 2>/dev/null || true
git remote add origin $CODECOMMIT_URL

echo "📤 Pushing code to CodeCommit..."
git push -u origin main

echo "🎉 CI/CD Pipeline Setup Complete!"
echo ""
echo "📋 Summary:"
echo "  CodeCommit Repository: $CODECOMMIT_URL"
echo "  CodeArtifact Endpoint: $CODEARTIFACT_ENDPOINT"
echo "  CodePipeline Name: $PIPELINE_NAME"
echo ""
echo "🔧 Next Steps:"
echo "  1. Push code changes to trigger the pipeline"
echo "  2. Monitor pipeline execution in AWS Console"
echo ""
echo "💡 Useful Commands:"
echo "  aws codepipeline start-pipeline-execution --name $PIPELINE_NAME"
echo "  aws codepipeline get-pipeline-state --name $PIPELINE_NAME"
