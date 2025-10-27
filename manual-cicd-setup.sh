#!/bin/bash

# Manual AWS CI/CD Setup Script
set -e

PROJECT_NAME="portfolio-react"
REGION="us-east-1"

echo "🚀 Setting up AWS CI/CD Services manually for ${PROJECT_NAME}"

# Check AWS CLI configuration
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI configured"

# 1. Create CodeCommit Repository
echo "📦 Creating CodeCommit repository..."
REPO_NAME="${PROJECT_NAME}-repo"
aws codecommit create-repository \
    --repository-name $REPO_NAME \
    --repository-description "Portfolio React application repository" \
    --region $REGION || echo "Repository might already exist"

CODECOMMIT_URL=$(aws codecommit get-repository \
    --repository-name $REPO_NAME \
    --region $REGION \
    --query 'repositoryMetadata.cloneUrlHttp' \
    --output text)

echo "✅ CodeCommit repository created: $CODECOMMIT_URL"

# 2. Create S3 Bucket for Artifacts
echo "📦 Creating S3 bucket for artifacts..."
BUCKET_NAME="${PROJECT_NAME}-artifacts-$(aws sts get-caller-identity --query Account --output text)"
aws s3 mb s3://$BUCKET_NAME --region $REGION || echo "Bucket might already exist"
aws s3api put-bucket-versioning \
    --bucket $BUCKET_NAME \
    --versioning-configuration Status=Enabled

echo "✅ S3 bucket created: $BUCKET_NAME"

# 3. Create CodeBuild Project
echo "📦 Creating CodeBuild project..."
cat > /tmp/buildspec.yml << 'EOF'
version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 18
  pre_build:
    commands:
      - echo Installing dependencies...
      - npm install
  build:
    commands:
      - echo Build started on `date`
      - npm run build
  post_build:
    commands:
      - echo Build completed on `date`
artifacts:
  files:
    - '**/*'
  base-directory: dist
EOF

# Create IAM role for CodeBuild
ROLE_NAME="${PROJECT_NAME}-codebuild-role"
cat > /tmp/trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

aws iam create-role \
    --role-name $ROLE_NAME \
    --assume-role-policy-document file:///tmp/trust-policy.json || echo "Role might already exist"

# Attach policies
aws iam attach-role-policy \
    --role-name $ROLE_NAME \
    --policy-arn arn:aws:iam::aws:policy/CloudWatchLogsFullAccess || true

aws iam attach-role-policy \
    --role-name $ROLE_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess || true

# Get role ARN
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)

# Create CodeBuild project
BUILD_PROJECT_NAME="${PROJECT_NAME}-build"
cat > /tmp/codebuild-project.json << EOF
{
  "name": "$BUILD_PROJECT_NAME",
  "source": {
    "type": "CODECOMMIT",
    "location": "$CODECOMMIT_URL",
    "buildspec": "buildspec.yml"
  },
  "artifacts": {
    "type": "S3",
    "location": "$BUCKET_NAME/builds"
  },
  "environment": {
    "type": "LINUX_CONTAINER",
    "image": "aws/codebuild/amazonlinux2-x86_64-standard:5.0",
    "computeType": "BUILD_GENERAL1_SMALL"
  },
  "serviceRole": "$ROLE_ARN"
}
EOF

aws codebuild create-project \
    --cli-input-json file:///tmp/codebuild-project.json \
    --region $REGION || echo "Project might already exist"

echo "✅ CodeBuild project created: $BUILD_PROJECT_NAME"

# 4. Setup local git repository
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    
    # Copy buildspec to project root
    cp /tmp/buildspec.yml ./buildspec.yml
    
    git add .
    git commit -m "Initial commit with CI/CD setup"
fi

# Add CodeCommit as remote
echo "🔧 Adding CodeCommit remote..."
git remote remove origin 2>/dev/null || true
git remote add origin $CODECOMMIT_URL

# Configure git credentials helper for CodeCommit
git config credential.helper '!aws codecommit credential-helper $@'
git config credential.UseHttpPath true

echo "📤 Pushing code to CodeCommit..."
git push -u origin main

# 5. Start a build
echo "🔨 Starting initial build..."
aws codebuild start-build \
    --project-name $BUILD_PROJECT_NAME \
    --region $REGION

echo "🎉 CI/CD Setup Complete!"
echo ""
echo "📋 Summary:"
echo "  CodeCommit Repository: $CODECOMMIT_URL"
echo "  S3 Artifacts Bucket: s3://$BUCKET_NAME"
echo "  CodeBuild Project: $BUILD_PROJECT_NAME"
echo ""
echo "🔧 Next Steps:"
echo "  1. Monitor build in AWS Console: https://console.aws.amazon.com/codesuite/codebuild/projects/$BUILD_PROJECT_NAME"
echo "  2. Push code changes to trigger new builds"
echo ""
echo "💡 Useful Commands:"
echo "  aws codebuild start-build --project-name $BUILD_PROJECT_NAME"
echo "  aws codebuild list-builds-for-project --project-name $BUILD_PROJECT_NAME"

# Cleanup temp files
rm -f /tmp/buildspec.yml /tmp/trust-policy.json /tmp/codebuild-project.json
