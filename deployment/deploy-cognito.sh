#!/bin/bash

# Deploy Cognito User Pool for Portfolio Authentication
echo "🚀 Deploying Cognito Authentication..."

# Set your admin email
ADMIN_EMAIL="zolisasilolo@gmail.com"

# Deploy Cognito stack
echo "📦 Creating Cognito User Pool..."
aws cloudformation deploy \
  --template-file cognito-template.yaml \
  --stack-name portfolio-cognito \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides AdminEmail="$ADMIN_EMAIL"

# Get stack outputs
echo "📋 Getting Cognito configuration..."
USER_POOL_ID=$(aws cloudformation describe-stacks \
  --stack-name portfolio-cognito \
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' \
  --output text)

CLIENT_ID=$(aws cloudformation describe-stacks \
  --stack-name portfolio-cognito \
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' \
  --output text)

IDENTITY_POOL_ID=$(aws cloudformation describe-stacks \
  --stack-name portfolio-cognito \
  --query 'Stacks[0].Outputs[?OutputKey==`IdentityPoolId`].OutputValue' \
  --output text)

REGION=$(aws cloudformation describe-stacks \
  --stack-name portfolio-cognito \
  --query 'Stacks[0].Outputs[?OutputKey==`Region`].OutputValue' \
  --output text)

# Update Amplify configuration
echo "🔧 Updating Amplify configuration..."
cat > src/amplifyconfiguration.json << EOF
{
  "aws_project_region": "$REGION",
  "aws_cognito_identity_pool_id": "$IDENTITY_POOL_ID",
  "aws_cognito_region": "$REGION",
  "aws_user_pools_id": "$USER_POOL_ID",
  "aws_user_pools_web_client_id": "$CLIENT_ID",
  "oauth": {},
  "aws_cognito_username_attributes": ["email"],
  "aws_cognito_social_providers": [],
  "aws_cognito_signup_attributes": ["email"],
  "aws_cognito_mfa_configuration": "OFF",
  "aws_cognito_mfa_types": ["SMS"],
  "aws_cognito_password_protection_settings": {
    "passwordPolicyMinLength": 8,
    "passwordPolicyCharacters": []
  },
  "aws_cognito_verification_mechanisms": ["email"]
}
EOF

echo "✅ Cognito authentication deployed successfully!"
echo ""
echo "📋 Configuration:"
echo "User Pool ID: $USER_POOL_ID"
echo "Client ID: $CLIENT_ID"
echo "Identity Pool ID: $IDENTITY_POOL_ID"
echo "Region: $REGION"
echo ""
echo "🔐 Admin Credentials:"
echo "Username: $ADMIN_EMAIL"
echo "Password: ZolisaAdmin2025!"
echo ""
echo "📝 Next steps:"
echo "1. Install dependencies: npm install"
echo "2. Build and deploy your app"
echo "3. Access your portfolio at: https://zolisasilolo.co.za"
echo "4. Login to AI_BUDDY at: https://zolisasilolo.co.za/chat"
echo "5. Access admin panel at: https://zolisasilolo.co.za/admin"
