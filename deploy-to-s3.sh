#!/bin/bash
# Deploy built files to S3
set -e

BUCKET="portfolio-react-artifacts-940482420916"
BUILD_DIR="dist"

if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build directory not found. Run 'npm run build' first."
    exit 1
fi

echo "📤 Deploying to S3..."
aws s3 sync $BUILD_DIR/ s3://$BUCKET/website/ --delete
echo "✅ Deployment complete!"
echo "🌐 Files uploaded to: https://$BUCKET.s3.amazonaws.com/website/index.html"
