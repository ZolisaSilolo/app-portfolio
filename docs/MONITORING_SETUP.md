# 🔍 Monitoring Setup Guide - Datadog + Sentry + AWS Agents

**Safe, sequential setup using GitHub Student Dev Pack free credits**

---

## ✅ Prerequisites

1. **GitHub Student Dev Pack**: https://education.github.com/pack
2. **Datadog Account**: Sign up with student email
3. **Sentry Account**: Sign up with student email
4. **AWS Secrets Manager**: Store API keys securely

---

## 📋 Phase 1: Sentry Frontend (5 min) ✅ SAFEST

### Step 1.1: Get Sentry DSN

```bash
# 1. Go to: https://sentry.io/signup/
# 2. Sign up with GitHub Student email
# 3. Create project: "portfolio-frontend" (React)
# 4. Copy your DSN (looks like: https://xxx@sentry.io/xxx)
```

### Step 1.2: Install Sentry

```bash
cd /mnt/e/app-portfolio
npm install @sentry/react
```

### Step 1.3: Configure Environment

```bash
# Add to .env (create from .env.example)
echo "VITE_SENTRY_DSN=your-sentry-dsn-here" >> .env
```

### Step 1.4: Test Locally

```bash
npm run dev
# Visit http://localhost:5173
# Check browser console - should see "Sentry initialized"
```

### Step 1.5: Deploy

```bash
git add .
git commit -m "feat: add Sentry error tracking to frontend"
git push origin new-react-client
# Amplify auto-deploys
```

**✅ Rollback**: Just remove VITE_SENTRY_DSN from .env

---

## 📋 Phase 2: Sentry Backend (10 min)

### Step 2.1: Create Backend Project in Sentry

```bash
# In Sentry dashboard:
# 1. Create new project: "portfolio-backend" (Python/AWS Lambda)
# 2. Copy DSN
```

### Step 2.2: Store DSN in Secrets Manager

```bash
aws secretsmanager create-secret \
  --name sentry-dsn \
  --description "Sentry DSN for Lambda error tracking" \
  --secret-string "your-backend-sentry-dsn" \
  --region us-east-1
```

### Step 2.3: Update Lambda Requirements

```bash
# Add to each Lambda function's requirements.txt
cd lambda/chatbot-api
echo "sentry-sdk[aws_lambda]==2.0.0" >> requirements.txt

cd ../portfolio-api
echo "sentry-sdk[aws_lambda]==2.0.0" >> requirements.txt

cd ../admin-upload
echo "sentry-sdk[aws_lambda]==2.0.0" >> requirements.txt
```

### Step 2.4: Update Lambda Code

```python
# Add to top of each lambda_function.py
import sys
sys.path.insert(0, '/opt/python')  # For Lambda layers

from shared.sentry_config import init_sentry

# Initialize at module level (outside handler)
init_sentry()

# Your existing handler code...
```

### Step 2.5: Deploy Backend

```bash
cd /mnt/e/app-portfolio/deployment
./deploy.sh
```

**✅ Rollback**: Redeploy without Sentry code

---

## 📋 Phase 3: Datadog APM (15 min)

### Step 3.1: Get Datadog API Key

```bash
# 1. Go to: https://www.datadoghq.com/
# 2. Sign up with GitHub Student email
# 3. Go to: Organization Settings > API Keys
# 4. Create new API key: "portfolio-lambda"
# 5. Copy key
```

### Step 3.2: Store API Key

```bash
aws secretsmanager create-secret \
  --name datadog-api-key \
  --description "Datadog API key for Lambda monitoring" \
  --secret-string "your-datadog-api-key" \
  --region us-east-1
```

### Step 3.3: Update Lambda IAM Permissions

```bash
# Add to deployment/template.yaml under Lambda execution role:
- Effect: Allow
  Action:
    - secretsmanager:GetSecretValue
  Resource:
    - !Sub "arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:datadog-api-key*"
    - !Sub "arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:sentry-dsn*"
```

### Step 3.4: Use Monitoring Template

```bash
# Backup current template
cp deployment/template.yaml deployment/template.backup.yaml

# Review new template
cat deployment/template-monitoring.yaml

# When ready, replace:
# cp deployment/template-monitoring.yaml deployment/template.yaml
```

### Step 3.5: Deploy with Datadog

```bash
cd /mnt/e/app-portfolio/deployment
./deploy.sh
```

### Step 3.6: Verify in Datadog

```bash
# 1. Go to: https://app.datadoghq.com/apm/services
# 2. Wait 2-3 minutes
# 3. Should see "portfolio-api" service
# 4. Make test request to your API
# 5. Check traces appear
```

**✅ Rollback**: Restore backup template and redeploy

---

## 📋 Phase 4: AWS DevOps Agent Integration (5 min)

### Step 4.1: Add Datadog to DevOps Agent

```bash
# In DevOps Agent console:
# 1. Go to: https://us-east-1.console.aws.amazon.com/aidevops/
# 2. Select: ZolisaPortfolioAgentSpace
# 3. Integrations > Add Integration > Datadog
# 4. Enter Datadog API key
# 5. Configure metrics to monitor:
#    - aws.lambda.errors
#    - aws.lambda.duration
#    - aws.apigateway.5xxerror
```

### Step 4.2: Test Integration

```bash
# In DevOps Agent chat:
"Show me Lambda error rate for the last hour"
"What's the p99 latency for portfolio-api?"
"Alert me if error rate exceeds 5%"
```

---

## 📋 Phase 5: AWS Security Agent Integration (5 min)

### Step 5.1: Configure Sentry Integration

```bash
# Security Agent can read Sentry errors to:
# - Identify error patterns
# - Test scenarios that cause errors
# - Validate if errors expose vulnerabilities

# In Security Agent console:
# 1. Go to pentest configuration
# 2. Add Sentry project URL
# 3. Security Agent will analyze error patterns during next scan
```

---

## 🎯 Verification Checklist

After each phase, verify:

### Frontend (Sentry)
- [ ] Visit https://zolisasilolo.co.za
- [ ] Open DevTools > Console
- [ ] Should see no Sentry errors
- [ ] Trigger test error: Click non-existent button
- [ ] Check Sentry dashboard for error

### Backend (Sentry)
- [ ] Make API request to /chat
- [ ] Check Sentry backend project
- [ ] Should see request logged
- [ ] Trigger error: Send invalid request
- [ ] Check Sentry for Lambda error

### Datadog
- [ ] Go to Datadog APM
- [ ] Should see "portfolio-api" service
- [ ] Check traces for recent requests
- [ ] View metrics dashboard
- [ ] Verify logs are flowing

### DevOps Agent
- [ ] Ask agent about metrics
- [ ] Should respond with Datadog data
- [ ] Test Slack notifications
- [ ] Verify correlation with deployments

### Security Agent
- [ ] Check current pentest status
- [ ] Should show "analyzing error patterns"
- [ ] Wait for completion
- [ ] Review findings related to errors

---

## 💰 Cost Tracking

### Free Tier Limits (GitHub Student Pack)

**Datadog**:
- ✅ $300/month credit
- ✅ ~20 hosts free
- ✅ APM included
- ✅ Log management: 150GB/month

**Sentry**:
- ✅ $29/month credit
- ✅ 100k errors/month
- ✅ Session replay included
- ✅ Performance monitoring

**AWS**:
- ✅ Secrets Manager: $0.40/secret/month
- ✅ Lambda: Free tier (1M requests)
- ✅ CloudWatch: Free tier (5GB logs)

**Total Monthly Cost**: ~$1 (just Secrets Manager)

---

## 🚨 Troubleshooting

### Sentry not initializing
```bash
# Check DSN is set
echo $VITE_SENTRY_DSN

# Check browser console for errors
# Should see: "Sentry initialized"
```

### Datadog not showing traces
```bash
# Check Lambda logs
aws logs tail /aws/lambda/portfolio-chatbot-api --follow

# Look for: "Datadog tracer started"
# If missing, check DD_API_KEY_SECRET_ARN is set
```

### DevOps Agent can't read Datadog
```bash
# Verify API key has correct permissions
# In Datadog: Organization Settings > API Keys
# Check "Read" permission is enabled
```

---

## 📊 What You'll See

### Datadog Dashboard
- Lambda invocations per minute
- Error rates by function
- P50/P95/P99 latency
- Cold start metrics
- DynamoDB performance

### Sentry Dashboard
- Frontend errors by page
- Backend errors by endpoint
- User session replays
- Performance bottlenecks
- Release tracking

### DevOps Agent
- Auto-investigations of issues
- Correlation with deployments
- Slack alerts on anomalies
- Suggested fixes

### Security Agent
- Vulnerabilities found via errors
- Attack scenarios tested
- Auto-generated fixes
- Pull requests with patches

---

## 🎓 Next Steps

1. **Start with Phase 1** (Sentry Frontend) - safest
2. **Test thoroughly** before moving to Phase 2
3. **Monitor costs** in AWS Cost Explorer
4. **Set up alerts** in Datadog for anomalies
5. **Review Sentry errors** weekly
6. **Let agents auto-investigate** issues

---

**Ready to start?** Begin with Phase 1! 🚀
