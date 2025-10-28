# Deployment Scripts

This directory contains all deployment-related files for the portfolio.

## Files

- `cognito-simple.yaml` - CloudFormation template for Cognito authentication
- `template.yaml` - SAM template for backend Lambda functions
- `deploy-cognito.sh` - Script to deploy Cognito User Pool
- `deploy.sh` - Script to deploy backend services

## Usage

1. **Deploy Authentication:**
   ```bash
   ./deployment/deploy-cognito.sh
   ```

2. **Deploy Backend:**
   ```bash
   ./deployment/deploy.sh
   ```
