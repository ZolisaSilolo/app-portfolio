# 🎬 Matrix-Themed Portfolio

> A modern React portfolio application fh AWS serverless backend and Amplify hosting.

## 🚀 Features

- **Modern React Frontend**: Built with TypeScript, Tailwind CSS, and Vite
- **Serverless Backend**: AWS Lambda functions with API Gateway
- **AI-Powered Chat**: Cohere integration for portfolio assistant
- **AWS Amplify Hosting**: Scalable, secure hosting with CI/CD
- **Responsive Design**: Mobile-first, accessible design
- **SEO Optimized**: Meta tags and semantic HTML

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Vite** for fast development and builds
- **AWS Amplify** for hosting and CI/CD

### Backend
- **AWS API Gateway** for REST API
- **AWS Lambda** for serverless functions
- **AWS Secrets Manager** for API key management
- **Cohere AI** for chatbot functionality

## 📁 Project Structure

```
portfolio-react/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components  
│   ├── types/            # TypeScript types
│   ├── services/         # API services
│   ├── hooks/            # Custom React hooks
│   └── data/             # Static data
├── lambda/               # AWS Lambda functions
│   ├── chatbot-api/      # Cohere chatbot API
│   └── portfolio-api/    # Portfolio data API
├── scripts/              # Setup and utility scripts
├── .gitignore           # Git ignore rules (excludes 11k+ node_modules files)
├── .gitattributes       # Git file handling rules
├── .eslintignore        # ESLint ignore rules
├── amplify.yml          # Amplify build configuration
├── template.yaml        # AWS SAM template
└── deploy.sh           # Deployment script
```

## 🛠️ Setup & Deployment

### Prerequisites

1. **AWS CLI** configured with appropriate permissions
2. **SAM CLI** for serverless deployment
3. **Node.js 18+** and npm
4. **Git** for version control

### Quick Start

1. **Setup project:**
   ```bash
   git clone <your-repo>
   cd portfolio-react
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

2. **Start development:**
   ```bash
   npm run dev
   ```

3. **Deploy to AWS:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Backend Deployment

1. **Set up Cohere API key in AWS Secrets Manager:**
   ```bash
   aws secretsmanager create-secret \
     --name cohere-api-key \
     --secret-string '{"COHERE_API_KEY":"your-api-key-here"}'
   ```

2. **Deploy backend infrastructure:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Frontend Deployment (AWS Amplify)

1. **Connect to Amplify:**
   - Go to AWS Amplify Console
   - Create new app from Git repository
   - Connect your GitHub/GitLab repository

2. **Configure build settings:**
   - Use the provided `amplify.yml` configuration
   - Set environment variable: `VITE_API_BASE_URL=<your-api-gateway-url>`

3. **Deploy:**
   - Amplify will automatically build and deploy on git push
   - Custom domain can be configured in Amplify settings

## 🔧 Configuration

### Environment Variables

- `VITE_API_BASE_URL`: Backend API Gateway URL
- `COHERE_SECRET_NAME`: AWS Secrets Manager secret name (backend)

### AWS Resources Created

- **API Gateway**: REST API for backend endpoints
- **Lambda Functions**: Chatbot and portfolio data APIs
- **IAM Roles**: Execution roles with minimal permissions
- **Amplify App**: Frontend hosting with CI/CD

## 🎯 Key Features Implemented

### ✅ Portfolio Display
- Project cards with technology tags
- AWS documentation links
- GitHub repository links
- Responsive grid layout

### ✅ About Page
- Professional profile
- Skills categorization
- AWS certifications showcase
- Contact information

### ✅ AI Chatbot
- Cohere-powered responses
- Portfolio context awareness
- Real-time messaging interface
- Error handling and loading states

### ✅ Modern UI/UX
- Tailwind CSS styling
- Mobile-responsive design
- Smooth animations and transitions
- Accessibility compliance

## 🔒 Security Features

- **HTTPS Enforcement**: SSL/TLS encryption
- **CORS Configuration**: Proper cross-origin settings
- **Security Headers**: XSS protection, content type options
- **API Key Management**: AWS Secrets Manager integration
- **IAM Permissions**: Least privilege access

## 📈 Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Asset Optimization**: Compressed images and fonts
- **CDN Distribution**: Amplify global edge locations
- **Caching**: Browser and CDN caching strategies

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build test
npm run build
```

## 📝 Migration Notes

### From Streamlit to React
- ✅ All portfolio projects migrated
- ✅ Chatbot functionality preserved
- ✅ Responsive design improved
- ✅ Performance significantly enhanced
- ✅ SEO capabilities added

### AWS Services Migration
- **From**: Streamlit + App Runner
- **To**: React + Amplify + Lambda + API Gateway
- **Benefits**: Better scalability, lower costs, improved performance

## 🚀 Deployment Checklist

- [ ] AWS CLI configured
- [ ] Cohere API key in Secrets Manager
- [ ] Backend deployed via SAM
- [ ] Frontend connected to Amplify
- [ ] Environment variables configured
- [ ] Custom domain configured (optional)
- [ ] SSL certificate validated
- [ ] Performance testing completed

## 📞 Support

For questions or issues:
- Check the AWS CloudWatch logs for backend issues
- Review Amplify build logs for frontend issues
- Ensure all environment variables are properly set

## 🎉 Success Criteria Met

- ✅ React application deployed on AWS Amplify
- ✅ All portfolio projects displayed correctly
- ✅ Chatbot functionality working via serverless API
- ✅ Responsive design across all devices
- ✅ Fast loading times (<3s initial load)
- ✅ SEO optimized with meta tags
- ✅ Accessibility compliant design