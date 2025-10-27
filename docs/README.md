# 📚 Documentation

Welcome to the Matrix Portfolio documentation!

## Quick Links

- **[Deployment Guide](./DEPLOYMENT.md)** - Complete deployment instructions
- **[Development Guide](./DEVELOPMENT.md)** - Local development and contribution guidelines
- **[Main README](../README.md)** - Project overview and quick start

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   API Gateway   │    │ Lambda Functions│
│   (Frontend)    │───▶│   (REST API)    │───▶│   (Backend)     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  AWS Amplify    │    │   CloudWatch    │    │ Secrets Manager │
│   (Hosting)     │    │    (Logs)       │    │  (API Keys)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Key Features

- **🎨 Matrix Theme**: Cyberpunk-inspired design with animations
- **🤖 AI Assistant**: Cohere-powered chatbot for portfolio interaction
- **📱 Responsive**: Mobile-first design that works on all devices
- **🔒 Secure**: AWS best practices with proper IAM and secret management
- **🚀 Fast**: Optimized build with Vite and modern React patterns
- **🔄 CI/CD**: Automated deployment with GitHub Actions

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **AWS Lambda** (Python 3.12)
- **API Gateway** for REST endpoints
- **Secrets Manager** for API key storage
- **CloudWatch** for logging

### Deployment
- **AWS Amplify** for frontend hosting
- **AWS SAM** for serverless backend
- **GitHub Actions** for CI/CD

## Getting Started

1. **New Users**: Start with the [Deployment Guide](./DEPLOYMENT.md)
2. **Developers**: Check the [Development Guide](./DEVELOPMENT.md)
3. **Quick Setup**: Follow the [Main README](../README.md)

## Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Join community discussions on GitHub
- **Documentation**: All guides are in this docs folder

---

**Happy coding! 🚀**
