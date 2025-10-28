# Security Guidelines

## 🔒 Environment Variables

**NEVER commit sensitive information to Git!**

### Required Environment Variables

Set these before deployment:

```bash
export ADMIN_EMAIL="your-admin@example.com"
export ADMIN_PASSWORD="YourSecurePassword123!"
```

### Local Development

1. Copy `.env.example` to `.env`
2. Update with your values
3. `.env` is automatically ignored by Git

### Production Deployment

Use AWS Systems Manager Parameter Store or AWS Secrets Manager:

```bash
# Store securely in AWS
aws ssm put-parameter --name "/portfolio/admin-email" --value "your-email" --type "SecureString"
aws ssm put-parameter --name "/portfolio/admin-password" --value "your-password" --type "SecureString"
```

## 🚨 Security Checklist

- [ ] No hardcoded passwords in source code
- [ ] No API keys in repository
- [ ] Environment variables used for sensitive data
- [ ] `.env` files in `.gitignore`
- [ ] Regular password rotation
- [ ] AWS IAM least privilege access

## 📋 What NOT to Commit

- Passwords or API keys
- `.env` files
- AWS credentials
- Private keys or certificates
- Database connection strings
- Any personally identifiable information (PII)

## 🔧 Secure Deployment

1. Use environment variables for all secrets
2. Enable AWS CloudTrail for audit logging
3. Use AWS WAF for web application firewall
4. Enable HTTPS/TLS encryption
5. Regular security updates

## 🆘 If Credentials Are Exposed

1. **Immediately** rotate all exposed credentials
2. Check AWS CloudTrail for unauthorized access
3. Update all affected systems
4. Consider using `git filter-branch` to remove from history
5. Force push cleaned repository

## 📞 Security Contact

Report security issues to: security@your-domain.com
