# 🎯 Get Your Sentry DSN (2 minutes)

## Step 1: Sign Up for Sentry

1. Go to: **https://sentry.io/signup/**
2. Click **"Sign up with GitHub"**
3. Use your GitHub Student account email
4. Authorize Sentry

## Step 2: Activate GitHub Student Pack

1. After signup, go to: **https://sentry.io/settings/billing/**
2. Click **"Apply Student Discount"**
3. Verify with GitHub Student Pack
4. You'll get **$29/month credit** (100k errors/month)

## Step 3: Create Frontend Project

1. Click **"Create Project"**
2. Select platform: **React**
3. Project name: **portfolio-frontend**
4. Team: **Personal** (or create new)
5. Click **"Create Project"**

## Step 4: Get Your DSN

After project creation, you'll see:

```
Configure your SDK:

Sentry.init({
  dsn: "https://abc123def456@o123456.ingest.sentry.io/7890123",
  ...
});
```

**Copy the DSN** (the long URL starting with `https://`)

## Step 5: Add DSN to .env

```bash
cd /mnt/e/app-portfolio

# Edit .env file
nano .env

# Replace this line:
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/your-project-id

# With your actual DSN:
VITE_SENTRY_DSN=https://abc123def456@o123456.ingest.sentry.io/7890123

# Save and exit (Ctrl+X, Y, Enter)
```

## Step 6: Test Locally

```bash
npm run dev
```

Visit: http://localhost:5173

Open browser console - you should see:
```
✅ Sentry initialized
```

## Step 7: Trigger Test Error

In browser console, run:
```javascript
throw new Error("Test error for Sentry");
```

Check Sentry dashboard - error should appear within 10 seconds!

## Step 8: Deploy to Production

```bash
# Commit (don't commit .env!)
git add package*.json
git commit -m "chore: install Sentry SDK"
git push

# Add DSN to Amplify environment variables:
# 1. Go to: https://console.aws.amazon.com/amplify/
# 2. Select your app
# 3. Environment variables > Manage variables
# 4. Add: VITE_SENTRY_DSN = your-dsn
# 5. Redeploy
```

---

## ✅ Verification Checklist

- [ ] Signed up for Sentry with GitHub
- [ ] Applied GitHub Student Pack discount
- [ ] Created portfolio-frontend project
- [ ] Copied DSN
- [ ] Added DSN to .env
- [ ] Tested locally (saw "Sentry initialized")
- [ ] Triggered test error
- [ ] Saw error in Sentry dashboard
- [ ] Added DSN to Amplify env vars
- [ ] Deployed to production

---

**Next**: Set up Sentry for backend (Lambda functions)
