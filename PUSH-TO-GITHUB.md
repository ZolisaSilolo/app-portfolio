# 🚀 Push to GitHub & Setup Amplify

## Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `portfolio-react`
3. Make it **Public** (for free GitHub Actions)
4. Don't initialize with README (we have files already)

## Step 2: Push Your Code
```bash
# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/portfolio-react.git

# Push to GitHub
git push -u origin main
```

## Step 3: Connect Amplify to GitHub
1. Go to **AWS Amplify Console**
2. Click **"New app"** → **"Host web app"**
3. Choose **GitHub** as source
4. Select your `portfolio-react` repository
5. Branch: `main`
6. Click **"Next"** → **"Save and deploy"**

## ✅ Result:
- **Automatic deployments** on every push to main
- **GitHub Actions** run tests and builds
- **Amplify** hosts your site with custom domain
- **Total cost**: $1-5/month

## 🎯 What Happens Next:
1. Every push to `main` triggers GitHub Actions
2. GitHub Actions runs tests and builds
3. Amplify automatically deploys the latest code
4. Your site updates within 2-3 minutes

**You're all set for professional CI/CD! 🎉**
