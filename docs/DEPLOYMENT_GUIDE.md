# 🚀 AWS Amplify Deployment Guide

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with your credentials
3. **SAM CLI** for serverless deployment
4. **Node.js 18+** and npm
5. **Git repository** (GitHub/GitLab/Bitbucket)

## Step 1: Backend Deployment

### 1.1 Set up Cohere API Key in AWS Secrets Manager

```bash
aws secretsmanager create-secret \
  --name cohere-api-key \
  --secret-string '{"COHERE_API_KEY":"your-cohere-api-key-here"}' \
  --region us-east-1
```

### 1.2 Deploy Backend Infrastructure

```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy backend (this will create API Gateway, Lambda functions, etc.)
./deploy.sh
```

### 1.3 Get API Gateway URL

After deployment, get your API Gateway URL:

```bash
aws cloudformation describe-stacks \
  --stack-name portfolio-backend \
  --query "Stacks[0].Outputs[?OutputKey=='PortfolioApiUrl'].OutputValue" \
  --output text
```

## Step 2: Frontend Deployment with AWS Amplify

### 2.1 Push Code to Git Repository

```bash
git add .
git commit -m "Portfolio ready for deployment"
git push origin main
```

### 2.2 Create Amplify App

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Connect your Git repository (GitHub/GitLab/Bitbucket)
4. Select your repository and branch (main/master)

### 2.3 Configure Build Settings

Amplify will auto-detect the `amplify.yml` file. Verify it contains:

```yaml
version: 1
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
      - node_modules/**/*
```

### 2.4 Set Environment Variables

In Amplify Console → App Settings → Environment Variables, add:

```
VITE_API_BASE_URL = https://your-api-gateway-url.execute-api.region.amazonaws.com/prod
```

### 2.5 Deploy

Click **"Save and deploy"**. Amplify will:
- Install dependencies
- Build the React app
- Deploy to global CDN
- Provide a live URL

## Step 3: Custom Domain (Optional)

### 3.1 Add Custom Domain

1. In Amplify Console → Domain Management
2. Click **"Add domain"**
3. Enter your domain name
4. Configure DNS settings as instructed

### 3.2 SSL Certificate

Amplify automatically provisions SSL certificates via AWS Certificate Manager.

## Step 4: Continuous Deployment

Once connected, Amplify will automatically:
- Deploy on every push to main branch
- Run build process
- Update live site
- Send notifications on build status

## Monitoring & Troubleshooting

### Build Logs
- Check Amplify Console → Build History for detailed logs
- Common issues: Node version, environment variables, build commands

### Backend Logs
```bash
# View Lambda logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/portfolio"

# View specific function logs
aws logs tail /aws/lambda/portfolio-chatbot-api --follow
```

### Performance Monitoring
- CloudWatch metrics for Lambda functions
- Amplify analytics for frontend performance
- API Gateway metrics for API calls

## Security Checklist

- ✅ API keys stored in AWS Secrets Manager
- ✅ HTTPS enforced via Amplify
- ✅ CORS properly configured
- ✅ IAM roles with minimal permissions
- ✅ Environment variables not exposed in frontend

## Cost Optimization

- **Amplify**: Pay per build minute + hosting
- **Lambda**: Pay per request (generous free tier)
- **API Gateway**: Pay per API call
- **Secrets Manager**: ~$0.40/month per secret

## Useful Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# Deploy backend only
npm run deploy:backend

# View CloudFormation stack
aws cloudformation describe-stacks --stack-name portfolio-backend

# Delete stack (cleanup)
aws cloudformation delete-stack --stack-name portfolio-backend
```

## Support

For issues:
1. Check Amplify build logs
2. Verify environment variables
3. Check AWS CloudWatch logs
4. Ensure all AWS services are in the same region

---

🎉 **Your Matrix-themed portfolio is now live on AWS!**
