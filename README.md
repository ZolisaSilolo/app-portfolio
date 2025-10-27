# 🎬 Matrix-Themed Portfolio

> A modern React portfolio application with AWS serverless backend and automated deployment.

## 🚀 Live Demo

- **Portfolio**: [https://d1qen9zpw73vjz.amplifyapp.com](https://d1qen9zpw73vjz.amplifyapp.com)
- **API**: [https://ih7tek9ql6.execute-api.us-east-1.amazonaws.com/prod](https://ih7tek9ql6.execute-api.us-east-1.amazonaws.com/prod)

## ✨ Features

- **Modern React Frontend**: TypeScript, Tailwind CSS, Vite
- **AI-Powered Chat**: Cohere integration for portfolio assistant
- **AWS Serverless Backend**: Lambda functions with API Gateway
- **Automated Deployment**: GitHub Actions + AWS Amplify
- **Matrix Theme**: Cyberpunk-inspired design with animations
- **Responsive Design**: Mobile-first, accessible
- **Security**: AWS Secrets Manager, IAM least privilege

## 🏗️ Architecture

For detailed architecture diagrams and technical documentation, see [ARCHITECTURE.md](docs/ARCHITECTURE.md).

```
Frontend (React + Vite)
    ↓
AWS Amplify (Hosting + CI/CD)
    ↓
API Gateway (REST API + Security)
    ↓
Lambda Functions (Python 3.12)
    ↓
AWS Secrets Manager (API Keys)
```

### Key Components
- **Frontend**: React + TypeScript with Matrix theme
- **Backend**: Serverless Lambda functions with AI integration
- **Security**: API Gateway usage plans, rate limiting, WAF protection
- **Deployment**: Automated CI/CD with GitHub Actions and AWS Amplify
- **Monitoring**: CloudWatch logs, metrics, and alerting

## 📁 Project Structure

```
portfolio/
├── src/                    # React source code
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts (theme)
│   └── services/          # API services
├── lambda/                # AWS Lambda functions
├── public/                # Static assets
├── .github/workflows/     # GitHub Actions (add manually)
└── template.yaml          # AWS SAM template
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- AWS CLI configured
- SAM CLI
- GitHub account

### 1. Clone & Setup

```bash
git clone <your-fork>
cd portfolio
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Update with your API endpoint
VITE_API_BASE_URL=https://your-api-gateway-url/prod
```

### 3. Deploy Backend

```bash
# Set up Cohere API key in AWS Secrets Manager
aws secretsmanager create-secret \
  --name portfolio-cohere-api-key \
  --secret-string '{"COHERE_API_KEY":"your-api-key"}'

# Deploy serverless backend
sam build && sam deploy --guided
```

### 4. Deploy Frontend

```bash
# Build locally
npm run build

# Or deploy to AWS Amplify (see deployment section)
```

## 🚀 Deployment Options

### Option A: AWS Amplify (Recommended)

1. **Create Amplify App**:
   ```bash
   aws amplify create-app --name your-portfolio --platform WEB
   ```

2. **Connect to GitHub** via AWS Console

3. **Add GitHub Actions Workflow**:
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to Amplify
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v4
       - uses: actions/setup-node@v4
         with:
           node-version: '18'
       - run: npm ci && npm run build
       - uses: aws-actions/configure-aws-credentials@v4
         with:
           aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
           aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
           aws-region: us-east-1
       - name: Deploy to Amplify
         run: |
           cd dist && zip -r ../build.zip .
           DEPLOYMENT=$(aws amplify create-deployment --app-id $APP_ID --branch-name main)
           UPLOAD_URL=$(echo $DEPLOYMENT | jq -r '.zipUploadUrl')
           curl -T build.zip "$UPLOAD_URL"
           aws amplify start-deployment --app-id $APP_ID --branch-name main --job-id $(echo $DEPLOYMENT | jq -r '.jobId')
   ```

### Option B: Manual Deployment

```bash
# Build and deploy manually
npm run build
# Upload dist/ to your hosting provider
```

## 🔧 Configuration

### Environment Variables

- `VITE_API_BASE_URL`: Backend API Gateway URL

### AWS Resources

- **Lambda Functions**: Chatbot, Auth, Portfolio APIs
- **API Gateway**: REST API endpoints
- **Secrets Manager**: API key storage
- **Amplify**: Frontend hosting
- **IAM**: Service roles and policies

## 🎨 Customization

### Theme Colors

Edit `src/index.css`:
```css
:root {
  --matrix-green: #00ff41;
  --matrix-cyan: #00ffff;
  --matrix-dark: #0d1117;
}
```

### Content

- **About**: Update `src/pages/About.tsx`
- **Projects**: Modify `src/data/projects.ts`
- **Skills**: Edit skill categories in About page

### AI Assistant

Update the chatbot context in `lambda/chatbot-api/lambda_function.py`:
```python
PORTFOLIO_CONTEXT = """
Your portfolio information here...
"""
```

## 🔒 Security Features

- **HTTPS Enforced**: SSL/TLS encryption
- **API Key Management**: AWS Secrets Manager
- **IAM Least Privilege**: Minimal permissions
- **CORS Configuration**: Proper cross-origin settings
- **Input Validation**: Sanitized user inputs

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Bundle Size**: ~215KB (gzipped: ~66KB)
- **Load Time**: <3s initial load
- **CDN**: Global edge locations via Amplify

## 🧪 Development

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

## 📝 API Endpoints

- `GET /health` - Health check
- `POST /chat` - AI chatbot
- `GET /portfolio` - Portfolio data
- `POST /auth` - Authentication

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/portfolio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/portfolio/discussions)
- **Email**: your-email@example.com

## 🎯 Roadmap

- [ ] Dark/Light theme toggle
- [ ] Blog integration
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] PWA capabilities

---

**Built with ❤️ using React, AWS, and modern web technologies.**
