#!/bin/bash

# Simple AWS CI/CD Setup Script (CodeBuild + S3)
set -e

PROJECT_NAME="portfolio-react"
REGION="us-east-1"

echo "🚀 Setting up Simple AWS CI/CD for ${PROJECT_NAME}"

# Check AWS CLI configuration
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✅ AWS CLI configured for account: $ACCOUNT_ID"

# 1. Create S3 Bucket for Artifacts
echo "📦 Creating S3 bucket for artifacts..."
BUCKET_NAME="${PROJECT_NAME}-artifacts-${ACCOUNT_ID}"
aws s3 mb s3://$BUCKET_NAME --region $REGION 2>/dev/null || echo "Bucket already exists"
aws s3api put-bucket-versioning \
    --bucket $BUCKET_NAME \
    --versioning-configuration Status=Enabled 2>/dev/null || true

echo "✅ S3 bucket ready: $BUCKET_NAME"

# 2. Create buildspec.yml
echo "📝 Creating buildspec.yml..."
cat > buildspec.yml << 'EOF'
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
      - echo Uploading to S3...
      - aws s3 sync dist/ s3://$ARTIFACTS_BUCKET/builds/$(date +%Y%m%d-%H%M%S)/
artifacts:
  files:
    - '**/*'
  base-directory: dist
EOF

# 3. Create IAM role for CodeBuild
echo "🔐 Creating IAM role for CodeBuild..."
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
    --assume-role-policy-document file:///tmp/trust-policy.json 2>/dev/null || echo "Role already exists"

# Create custom policy for S3 access
cat > /tmp/codebuild-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:${REGION}:${ACCOUNT_ID}:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::${BUCKET_NAME}",
        "arn:aws:s3:::${BUCKET_NAME}/*"
      ]
    }
  ]
}
EOF

POLICY_NAME="${PROJECT_NAME}-codebuild-policy"
aws iam create-policy \
    --policy-name $POLICY_NAME \
    --policy-document file:///tmp/codebuild-policy.json 2>/dev/null || echo "Policy already exists"

# Attach policy to role
POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/${POLICY_NAME}"
aws iam attach-role-policy \
    --role-name $ROLE_NAME \
    --policy-arn $POLICY_ARN 2>/dev/null || true

# Get role ARN
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)
echo "✅ IAM role created: $ROLE_ARN"

# 4. Create CodeBuild project
echo "🔨 Creating CodeBuild project..."
BUILD_PROJECT_NAME="${PROJECT_NAME}-build"

cat > /tmp/codebuild-project.json << EOF
{
  "name": "$BUILD_PROJECT_NAME",
  "source": {
    "type": "NO_SOURCE",
    "buildspec": "buildspec.yml"
  },
  "artifacts": {
    "type": "S3",
    "location": "$BUCKET_NAME/builds"
  },
  "environment": {
    "type": "LINUX_CONTAINER",
    "image": "aws/codebuild/amazonlinux2-x86_64-standard:5.0",
    "computeType": "BUILD_GENERAL1_SMALL",
    "environmentVariables": [
      {
        "name": "ARTIFACTS_BUCKET",
        "value": "$BUCKET_NAME"
      }
    ]
  },
  "serviceRole": "$ROLE_ARN"
}
EOF

aws codebuild create-project \
    --cli-input-json file:///tmp/codebuild-project.json \
    --region $REGION 2>/dev/null || echo "Project already exists"

echo "✅ CodeBuild project created: $BUILD_PROJECT_NAME"

# 5. Create deployment script
echo "📝 Creating deployment scripts..."
cat > deploy-to-s3.sh << EOF
#!/bin/bash
# Deploy built files to S3
set -e

BUCKET="$BUCKET_NAME"
BUILD_DIR="dist"

if [ ! -d "\$BUILD_DIR" ]; then
    echo "❌ Build directory not found. Run 'npm run build' first."
    exit 1
fi

echo "📤 Deploying to S3..."
aws s3 sync \$BUILD_DIR/ s3://\$BUCKET/website/ --delete
echo "✅ Deployment complete!"
echo "🌐 Files uploaded to: https://\$BUCKET.s3.amazonaws.com/website/index.html"
EOF

chmod +x deploy-to-s3.sh

cat > trigger-build.sh << EOF
#!/bin/bash
# Trigger CodeBuild manually
set -e

echo "🔨 Starting CodeBuild..."
BUILD_ID=\$(aws codebuild start-build \\
    --project-name $BUILD_PROJECT_NAME \\
    --region $REGION \\
    --query 'build.id' \\
    --output text)

echo "✅ Build started: \$BUILD_ID"
echo "🔍 Monitor at: https://console.aws.amazon.com/codesuite/codebuild/projects/$BUILD_PROJECT_NAME/build/\$BUILD_ID"
EOF

chmod +x trigger-build.sh

# 6. Update package.json with CI/CD scripts
echo "📝 Adding CI/CD scripts to package.json..."
if [ -f "package.json" ]; then
    # Create backup
    cp package.json package.json.backup
    
    # Add scripts using node
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts = pkg.scripts || {};
    pkg.scripts['deploy'] = './deploy-to-s3.sh';
    pkg.scripts['build:ci'] = './trigger-build.sh';
    pkg.scripts['build:prod'] = 'NODE_ENV=production npm run build';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    " 2>/dev/null || echo "Could not update package.json automatically"
fi

# Cleanup temp files
rm -f /tmp/trust-policy.json /tmp/codebuild-policy.json /tmp/codebuild-project.json

echo "🎉 Simple CI/CD Setup Complete!"
echo ""
echo "📋 Summary:"
echo "  S3 Artifacts Bucket: s3://$BUCKET_NAME"
echo "  CodeBuild Project: $BUILD_PROJECT_NAME"
echo "  IAM Role: $ROLE_ARN"
echo ""
echo "🔧 Usage:"
echo "  npm run build        # Build locally"
echo "  npm run deploy       # Deploy to S3"
echo "  npm run build:ci     # Trigger CodeBuild"
echo ""
echo "💡 Manual Commands:"
echo "  ./trigger-build.sh   # Start CodeBuild"
echo "  ./deploy-to-s3.sh    # Deploy to S3"
echo ""
echo "🌐 Monitor builds at:"
echo "  https://console.aws.amazon.com/codesuite/codebuild/projects/$BUILD_PROJECT_NAME"
