# 🚀 Quick Setup Commands

## Phase 1: Sentry Frontend (5 min)
```bash
cd /mnt/e/app-portfolio
npm install @sentry/react
echo "VITE_SENTRY_DSN=your-dsn" >> .env
npm run dev  # Test locally
git add . && git commit -m "feat: add Sentry" && git push
```

## Phase 2: Sentry Backend (10 min)
```bash
aws secretsmanager create-secret --name sentry-dsn --secret-string "your-dsn" --region us-east-1
cd lambda/chatbot-api && echo "sentry-sdk[aws_lambda]==2.0.0" >> requirements.txt
cd ../../deployment && ./deploy.sh
```

## Phase 3: Datadog (15 min)
```bash
aws secretsmanager create-secret --name datadog-api-key --secret-string "your-key" --region us-east-1
cp deployment/template.yaml deployment/template.backup.yaml
# Review template-monitoring.yaml, then:
# cp deployment/template-monitoring.yaml deployment/template.yaml
cd deployment && ./deploy.sh
```

## Verify Everything
```bash
# Check Sentry: https://sentry.io/
# Check Datadog: https://app.datadoghq.com/apm/services
# Check DevOps Agent: https://us-east-1.console.aws.amazon.com/aidevops/
# Check Security Agent: https://us-east-1.console.aws.amazon.com/securityagent/
```

## Monitor Pentest
```bash
aws securityagent batch-get-pentest-jobs \
  --agent-space-id "as-5d606d81-f88e-4d48-b814-7d36bb99aa38" \
  --pentest-job-ids "pj-ec704e20-a2c2-437a-8c08-4ad799e8cb5a" \
  --region us-east-1 \
  --query 'pentestJobs[0].{Status:status,Phase:steps[?status==`IN_PROGRESS`].name|[0]}'
```
