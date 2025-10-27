# AWS CI/CD Pipeline Setup

Complete CI/CD pipeline using AWS CodeCommit, CodeArtifact, CodeBuild, CodeDeploy, and CodePipeline.

## 🏗️ Architecture

```
CodeCommit → CodePipeline → CodeBuild → CodeDeploy → EC2/On-Premises
     ↓            ↓            ↓           ↓
CodeArtifact   S3 Artifacts  Build/Test  Deploy
```

## 🚀 Quick Setup

1. **Deploy the infrastructure:**
   ```bash
   ./setup-cicd.sh
   ```

2. **Configure your package.json:**
   ```bash
   # Merge the CI/CD scripts into your existing package.json
   cat package-cicd.json
   ```

## 📦 Services Overview

### CodeCommit
- **Purpose**: Source control repository
- **Features**: Git-based, integrated with AWS IAM
- **Location**: Private AWS Git repository

### CodeArtifact
- **Purpose**: Private npm package repository
- **Features**: Caches public npm packages, stores private packages
- **Benefits**: Faster builds, dependency management

### CodeBuild
- **Purpose**: Build and test automation
- **Features**: 
  - Runs tests with coverage
  - Linting and code quality checks
  - Builds production artifacts
- **Configuration**: `buildspec.yml`

### CodeDeploy
- **Purpose**: Application deployment
- **Features**: 
  - Blue/green deployments
  - Rollback capabilities
  - Health checks
- **Configuration**: `appspec.yml`

### CodePipeline
- **Purpose**: Orchestrates the entire CI/CD workflow
- **Stages**: Source → Build → Deploy

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `aws-cicd-setup.yaml` | CloudFormation template |
| `buildspec.yml` | CodeBuild configuration |
| `appspec.yml` | CodeDeploy configuration |
| `scripts/*.sh` | Deployment hooks |

## 🎯 Pipeline Stages

### 1. Source Stage
- Triggers on code push to main branch
- Pulls latest code from CodeCommit

### 2. Build Stage
- Installs dependencies from CodeArtifact
- Runs linting and tests
- Builds production artifacts
- Generates test coverage reports

### 3. Deploy Stage
- Deploys to EC2 instances or on-premises servers
- Runs health checks
- Provides rollback capability

## 🛠️ Local Development

### Configure CodeArtifact
```bash
# Get authentication token
aws codeartifact get-authorization-token \
  --domain portfolio-react-domain \
  --query authorizationToken --output text

# Configure npm
npm config set registry https://portfolio-react-domain-ACCOUNT.d.codeartifact.REGION.amazonaws.com/npm/portfolio-react-npm-repo/
```

### Useful Commands
```bash
# Start pipeline manually
aws codepipeline start-pipeline-execution --name portfolio-react-pipeline

# Check pipeline status
aws codepipeline get-pipeline-state --name portfolio-react-pipeline

# View build logs
aws logs describe-log-groups --log-group-name-prefix /aws/codebuild/portfolio-react-build
```

## 🎛️ Environment Variables

Set these in AWS Systems Manager Parameter Store:

| Parameter | Description |
|-----------|-------------|
| `/portfolio/api-base-url` | Backend API URL |
| `/portfolio/environment` | Environment (dev/staging/prod) |

## 🔒 Security Features

- **IAM Roles**: Least privilege access
- **Encryption**: Artifacts encrypted in S3
- **VPC**: Optional VPC deployment
- **Secrets**: Stored in Parameter Store/Secrets Manager

## 📊 Monitoring

- **CloudWatch Logs**: Build and deployment logs
- **CloudWatch Metrics**: Pipeline success/failure rates
- **SNS Notifications**: Pipeline status alerts

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check CodeBuild logs in CloudWatch
   - Verify buildspec.yml syntax
   - Check CodeArtifact permissions

2. **Deployment Fails**
   - Verify EC2 instance has CodeDeploy agent
   - Check appspec.yml configuration
   - Review deployment scripts

3. **Pipeline Stuck**
   - Check IAM permissions
   - Verify S3 bucket access
   - Review CloudFormation stack status

### Debug Commands
```bash
# Check CodeDeploy agent status
sudo service codedeploy-agent status

# View deployment logs
tail -f /var/log/aws/codedeploy-agent/codedeploy-agent.log

# Test nginx configuration
sudo nginx -t
```

## 🔄 Rollback Process

1. **Automatic**: CodeDeploy automatically rolls back on failure
2. **Manual**: Use AWS Console or CLI to trigger rollback
3. **Blue/Green**: Switch traffic back to previous version

## 📈 Best Practices

1. **Branch Protection**: Use feature branches, protect main
2. **Testing**: Comprehensive test coverage (>80%)
3. **Monitoring**: Set up CloudWatch alarms
4. **Security**: Regular security scans and updates
5. **Documentation**: Keep deployment docs updated

## 🎉 Success Criteria

- ✅ Automated builds on code push
- ✅ Comprehensive testing pipeline
- ✅ Zero-downtime deployments
- ✅ Automatic rollback on failure
- ✅ Monitoring and alerting
- ✅ Security best practices
