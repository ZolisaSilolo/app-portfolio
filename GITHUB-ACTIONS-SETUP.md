# 🚀 GitHub Actions Setup Guide

## Option 2: GitHub Actions + Amplify (Recommended for Cost)

### **Total Cost: $1-5/month**
- Amplify hosting: $1-5/month
- GitHub Actions: FREE (2000 minutes/month)
- No AWS CI/CD services needed

## 🔧 Setup Steps:

### 1. **Push to GitHub**
```bash
# Create GitHub repo and push your code
git remote add origin https://github.com/yourusername/portfolio-react.git
git push -u origin main
```

### 2. **Connect Amplify to GitHub**
- Go to AWS Amplify Console
- Choose "Host web app"
- Connect to GitHub repository
- Amplify will auto-deploy on every push

### 3. **Add GitHub Secrets (Optional)**
If you need AWS credentials in GitHub Actions:
- Go to GitHub repo → Settings → Secrets
- Add: `AWS_ACCESS_KEY_ID`
- Add: `AWS_SECRET_ACCESS_KEY`

### 4. **Workflow Triggers**
- ✅ **Auto-deploy** on push to main
- ✅ **Run tests** before deployment
- ✅ **Build optimization** 
- ✅ **Error notifications**

## 🎯 **Why This is Better:**

### **Cost Savings:**
- No CodeBuild charges ($0.005/minute saved)
- No S3 storage for artifacts
- No CodePipeline fees ($1/month saved)

### **Simplicity:**
- GitHub handles CI/CD
- Amplify handles hosting
- One less service to manage

### **Features:**
- Pull request previews
- Automatic deployments
- Build status badges
- Integration with GitHub ecosystem

## 🔄 **Migration from AWS CI/CD:**

### **Keep:**
- Amplify hosting (already working)
- Lambda functions (backend)
- Your existing domain setup

### **Remove:**
```bash
# Run cleanup script
./cleanup-aws-services.sh
```

### **Result:**
- Same functionality
- Lower cost
- Simpler management
- Better GitHub integration

## ✅ **Recommendation:**

**Use GitHub Actions** for your portfolio project because:
1. **Cheaper** ($3-5/month savings)
2. **Simpler** (fewer AWS services)
3. **Better integration** with GitHub
4. **More familiar** workflow for developers
5. **Free CI/CD** up to 2000 minutes/month

Your current Amplify setup already works great - just let GitHub handle the CI/CD part!
