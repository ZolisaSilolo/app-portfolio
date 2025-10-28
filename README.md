# 🎬 Matrix-Themed Portfolio

> A modern React portfolio with AWS Cognito authentication, serverless backend, and automated deployment.

## 🚀 Live Demo

- **Portfolio**: [https://zolisasilolo.co.za](https://zolisasilolo.co.za)
- **AI_BUDDY**: [https://zolisasilolo.co.za/chat](https://zolisasilolo.co.za/chat) (Public signup)
- **Admin Panel**: [https://zolisasilolo.co.za/admin](https://zolisasilolo.co.za/admin) (Admin only)
- **Blog**: [https://zolisasilolo.co.za/blog](https://zolisasilolo.co.za/blog)

## ✨ Features

- **Modern React Frontend**: TypeScript, Tailwind CSS, Vite
- **AWS Cognito Authentication**: Public signup + Admin access
- **AI-Powered Chat**: Cohere integration for portfolio assistant
- **Blog System**: Markdown-based with search and categories
- **AWS Serverless Backend**: Lambda functions with API Gateway
- **Matrix Theme**: Cyberpunk-inspired design with animations
- **Responsive Design**: Mobile-first, accessible

## 🏗️ Architecture

```
Frontend (React + TypeScript + Cognito)
    ↓
AWS Amplify (Hosting + CI/CD)
    ↓
API Gateway (REST API + Security)
    ↓
Lambda Functions (Python 3.12)
    ↓
AWS Secrets Manager (API Keys)
```

## 📁 Project Structure

```
portfolio/
├── src/                    # React source code
│   ├── components/         # Reusable components
│   ├── pages/             # Page components (Home, Blog, Chat, Admin, About)
│   ├── contexts/          # React contexts (Auth, Theme)
│   ├── data/              # Static data (projects, blog posts)
│   ├── services/          # API services
│   └── hooks/             # Custom React hooks
├── deployment/            # Deployment scripts and templates
│   ├── cognito-simple.yaml    # Cognito CloudFormation
│   ├── template.yaml          # SAM backend template
│   ├── deploy-cognito.sh      # Cognito deployment
│   └── deploy.sh              # Backend deployment
├── lambda/                # AWS Lambda functions
├── public/                # Static assets and images
└── docs/                  # Documentation
```

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- AWS CLI configured
- SAM CLI

### 1. Clone & Setup
```bash
git clone <your-repo>
cd portfolio
npm install
```

### 2. Deploy Authentication
```bash
./deployment/deploy-cognito.sh
```

### 3. Deploy Backend
```bash
./deployment/deploy.sh
```

### 4. Environment Configuration
```bash
# Copy environment template
cp .env.example .env
# Update with your API endpoint from deployment output
```

### 5. Build & Deploy Frontend
```bash
npm run build
# Deploy to AWS Amplify via GitHub Actions
```

## 🔐 Authentication

### Admin Access
- **Username**: `zolisasilolo@gmail.com`
- **Password**: `ZolisaAdmin2025!`
- **Access**: Admin panel + AI_BUDDY

### Public Access
- **AI_BUDDY**: Anyone can sign up
- **Blog**: Public reading, admin publishing

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

### Blog Content
Add posts to `src/data/blogPosts.ts` or use admin panel for uploads.

### Projects
Update `src/data/projects.ts` with your project information.

## 📊 Performance
- **Lighthouse Score**: 95+ across all metrics
- **Bundle Size**: ~383KB (gzipped: ~113KB)
- **Load Time**: <3s initial load

## 🧪 Development
```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build
```

## 📝 API Endpoints
- `GET /health` - Health check
- `POST /chat` - AI chatbot
- `GET /portfolio` - Portfolio data

## 🔒 Security Features
- **AWS Cognito**: Enterprise-grade authentication
- **Group-based Access**: Admin vs Public users
- **HTTPS Enforced**: SSL/TLS encryption
- **API Key Management**: AWS Secrets Manager
- **CORS Configuration**: Proper cross-origin settings

## 🚀 Deployment

### Automatic (Recommended)
Push to `main` branch triggers GitHub Actions → AWS Amplify deployment

### Manual
```bash
npm run build
# Upload dist/ to your hosting provider
```

## 🤝 Contributing
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License
MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support
- **Issues**: [GitHub Issues](https://github.com/ZolisaSilolo/app-portfolio/issues)
- **Email**: zolisasilolo@gmail.com

---

**Built with ❤️ using React, AWS Cognito, and modern web technologies.**
