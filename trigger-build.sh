#!/bin/bash
# Trigger CodeBuild manually
set -e

echo "🔨 Starting CodeBuild..."
BUILD_ID=$(aws codebuild start-build \
    --project-name portfolio-react-build \
    --region us-east-1 \
    --query 'build.id' \
    --output text)

echo "✅ Build started: $BUILD_ID"
echo "🔍 Monitor at: https://console.aws.amazon.com/codesuite/codebuild/projects/portfolio-react-build/build/$BUILD_ID"
