# Security Guidelines

## 🔒 Environment Variables

**NEVER commit sensitive information to Git!**

### Required Environment Variables

| Variable | Where used | Purpose |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Frontend (Vite build) | Admin page access password |
| `VITE_API_BASE_URL` | Frontend (Vite build) | API Gateway base URL |
| `ADMIN_PASSWORD` | `admin-upload` Lambda | Server-side admin upload auth |
| `CORS_ORIGIN` | All Lambdas | Allowed CORS origin (e.g. `https://yourdomain.com`) |
| `CONTENT_BUCKET` | `admin-upload` Lambda | S3 bucket name for uploads |
| `SESSION_TABLE` | `session-manager` Lambda | DynamoDB session table name |
| `ANALYTICS_TABLE` | `session-manager` Lambda | DynamoDB analytics table name |
| `RATE_LIMIT_TABLE` | `chatbot-api` Lambda | DynamoDB rate-limit table name |
| `COHERE_SECRET_NAME` | `chatbot-api` Lambda | AWS Secrets Manager secret name |

### Local Development

1. Copy `.env.example` to `.env`
2. Update with your values
3. `.env` is automatically ignored by Git

### Production Deployment

Use AWS Systems Manager Parameter Store or AWS Secrets Manager:

```bash
# Store securely in AWS
aws ssm put-parameter --name "/portfolio/admin-password" --value "your-password" --type "SecureString"
aws ssm put-parameter --name "/portfolio/cors-origin"   --value "https://yourdomain.com" --type "String"
```

## 🚨 Security Checklist

- [x] No hardcoded passwords in source code (`VITE_ADMIN_PASSWORD` env var used)
- [x] No API keys in repository
- [x] Environment variables used for all sensitive data
- [x] `.env` files in `.gitignore`
- [x] Ad-hoc test scripts ignored (`test-*.js`, `test-*.html`)
- [x] Rate limiting enforced in `chatbot-api` Lambda (DynamoDB-backed)
- [x] Message length validated before forwarding to AI provider (≤ 1 000 chars)
- [x] CORS restricted to configurable origin via `CORS_ORIGIN` env var
- [x] Constant-time password comparison used in `admin-upload` Lambda (timing-attack resistant)
- [x] File-type and MIME-type allowlist enforced in `admin-upload` Lambda
- [x] Internal error details suppressed in all Lambda error responses (logged server-side only)
- [x] Session TTL reduced to 7 days (was 30 days)
- [ ] Regular password rotation
- [ ] AWS IAM least-privilege access review
- [ ] Enable AWS CloudTrail for audit logging
- [ ] Enable AWS WAF on API Gateway

## 📋 What NOT to Commit

- Passwords or API keys
- `.env` files
- AWS credentials
- Private keys or certificates
- Database connection strings
- Ad-hoc test scripts (`test-*.js`, `test-*.html`)
- Any personally identifiable information (PII)

## ⚠️ Client-Side Admin Password Note

`VITE_ADMIN_PASSWORD` is embedded in the JavaScript bundle at build time.
It is suitable only for low-risk gating of the local blog-manager tool.
For anything requiring real security, protect the `/admin` route with
server-side authentication (e.g. AWS Cognito + JWT) instead.

## �� Secure Deployment

1. Set `CORS_ORIGIN` to your production domain on every Lambda function
2. Set `VITE_ADMIN_PASSWORD` to a strong, unique value in your CI/CD environment
3. Use AWS Secrets Manager for `COHERE_SECRET_NAME` secret
4. Enable AWS CloudTrail for audit logging
5. Use AWS WAF on your API Gateway
6. Enable HTTPS/TLS everywhere
7. Review IAM roles — apply least-privilege access

## 🆘 If Credentials Are Exposed

1. **Immediately** rotate all exposed credentials
2. Check AWS CloudTrail for unauthorized access
3. Update all affected systems
4. Use `git filter-repo` (or BFG Repo Cleaner) to scrub secrets from history
5. Force-push the cleaned repository

## 📞 Security Contact

Report security issues to: security@your-domain.com
