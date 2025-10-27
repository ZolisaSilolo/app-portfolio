# 🚀 Deployment Guide

This guide will help you deploy your own instance of the Matrix Portfolio.

## Prerequisites

- AWS Account with CLI configured
- GitHub account
- Node.js 18+
- SAM CLI installed

## Step 1: Fork & Clone

```bash
# Fork this repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
npm install
```

## Step 2: Backend Deployment

### 2.1 Set up Cohere API Key

```bash
# Get your API key from https://cohere.ai
# Store it in AWS Secrets Manager
aws secretsmanager create-secret \
  --name portfolio-cohere-api-key \
  --secret-string '{"COHERE_API_KEY":"your-cohere-api-key-here"}'
```

### 2.2 Deploy Lambda Functions

```bash
# Build and deploy serverless backend
sam build
sam deploy --guided

# Follow the prompts:
# - Stack Name: portfolio-backend
# - AWS Region: us-east-1 (or your preferred region)
# - Confirm changes before deploy: Y
# - Allow SAM CLI IAM role creation: Y
# - Save parameters to samconfig.toml: Y
```

### 2.3 Note Your API Gateway URL

After deployment, note the API Gateway URL from the outputs:
```
Outputs:
ApiGatewayUrl = https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod
```

## Step 3: Frontend Configuration

### 3.1 Update Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your API Gateway URL
VITE_API_BASE_URL=https://your-api-gateway-url/prod
```

### 3.2 Test Locally

```bash
npm run dev
# Visit http://localhost:5173
```

## Step 4: AWS Amplify Deployment

### 4.1 Create Amplify App

```bash
aws amplify create-app \
  --name your-portfolio \
  --platform WEB \
  --description "My Matrix-themed portfolio"
```

### 4.2 Create Branch

```bash
# Note the app ID from the previous command
aws amplify create-branch \
  --app-id YOUR_APP_ID \
  --branch-name main \
  --stage PRODUCTION \
  --enable-auto-build \
  --build-spec "version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*" \
  --environment-variables VITE_API_BASE_URL=https://your-api-gateway-url/prod
```

### 4.3 Connect to GitHub (Manual Step)

1. Go to AWS Amplify Console
2. Select your app
3. Connect to your GitHub repository
4. Select the `main` branch
5. Confirm build settings

## Step 5: Automated Deployment (Optional)

### 5.1 Create IAM User for GitHub Actions

```bash
# Create user
aws iam create-user --user-name github-actions-amplify

# Create policy
aws iam create-policy \
  --policy-name AmplifyDeploymentAccess \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "amplify:ListApps",
          "amplify:CreateDeployment",
          "amplify:StartDeployment",
          "amplify:GetDeployment"
        ],
        "Resource": "*"
      }
    ]
  }'

# Attach policy
aws iam attach-user-policy \
  --user-name github-actions-amplify \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/AmplifyDeploymentAccess

# Create access keys
aws iam create-access-key --user-name github-actions-amplify
```

### 5.2 Add GitHub Secrets

In your GitHub repository settings, add these secrets:
- `AWS_ACCESS_KEY_ID`: From the access key creation
- `AWS_SECRET_ACCESS_KEY`: From the access key creation

### 5.3 Add GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Amplify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build project
      run: npm run build
      env:
        VITE_API_BASE_URL: https://your-api-gateway-url/prod
        
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
        
    - name: Create deployment package
      run: |
        cd dist
        zip -r ../deployment.zip .
        
    - name: Deploy to Amplify
      run: |
        APP_ID="YOUR_APP_ID"
        BRANCH_NAME="main"
        
        # Create deployment
        DEPLOYMENT_ID=$(aws amplify create-deployment \
          --app-id $APP_ID \
          --branch-name $BRANCH_NAME \
          --query 'deploymentId' \
          --output text)
          
        # Get upload URL
        UPLOAD_URL=$(aws amplify create-deployment \
          --app-id $APP_ID \
          --branch-name $BRANCH_NAME \
          --query 'zipUploadUrl' \
          --output text)
          
        # Upload artifacts
        curl -T deployment.zip "$UPLOAD_URL"
        
        # Start deployment
        aws amplify start-deployment \
          --app-id $APP_ID \
          --branch-name $BRANCH_NAME \
          --deployment-id $DEPLOYMENT_ID
```

## Step 6: Customization

### 6.1 Update Content

- Edit `src/pages/About.tsx` for your information
- Update `src/data/projects.ts` with your projects
- Modify `lambda/chatbot-api/lambda_function.py` for your AI assistant context

### 6.2 Styling

- Colors: Edit CSS variables in `src/index.css`
- Theme: Modify components in `src/components/`
- Layout: Update page components in `src/pages/`

## 🎉 You're Done!

Your portfolio should now be live at your Amplify domain. Every push to your main branch will automatically deploy updates.

## Troubleshooting

### Common Issues

1. **Build fails**: Check Node.js version (requires 18+)
2. **API errors**: Verify Secrets Manager has the correct API key
3. **Deployment fails**: Check IAM permissions for Amplify user
4. **CORS errors**: Ensure API Gateway CORS is configured

### Getting Help

- Check AWS CloudWatch logs for Lambda errors
- Review Amplify build logs in the console
- Verify environment variables are set correctly
