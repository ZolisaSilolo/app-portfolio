# 🛠️ Development Guide

This guide covers local development, testing, and contribution guidelines.

## Development Setup

### Prerequisites

- Node.js 18+
- AWS CLI configured
- SAM CLI
- Git

### Local Development

```bash
# Clone and install
git clone <your-fork>
cd portfolio
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Backend Development

```bash
# Start local API Gateway and Lambda
sam local start-api --port 3001

# Test endpoints
curl http://localhost:3001/health
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   └── Loading.tsx     # Loading spinner
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── About.tsx       # About page
│   ├── Portfolio.tsx   # Projects showcase
│   └── Chat.tsx        # AI assistant
├── contexts/           # React contexts
│   └── ThemeContext.tsx # Dark/light theme
├── services/           # API services
│   └── api.ts          # API client
├── data/               # Static data
│   └── projects.ts     # Project information
└── types/              # TypeScript types
    └── index.ts        # Type definitions
```

## Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # ESLint
npm run type-check      # TypeScript checking

# Backend
sam build               # Build Lambda functions
sam local start-api     # Start local API
sam deploy              # Deploy to AWS
```

## Styling Guidelines

### CSS Architecture

- **Tailwind CSS**: Utility-first framework
- **CSS Variables**: For theme colors
- **Component Classes**: For reusable styles

### Theme System

```css
/* Light/Dark theme variables */
:root {
  --matrix-green: #00ff41;
  --matrix-cyan: #00ffff;
  --matrix-dark: #0d1117;
}

.dark {
  --bg-primary: var(--matrix-dark);
  --text-primary: var(--matrix-green);
}
```

### Component Patterns

```tsx
// Consistent component structure
const Component = () => {
  return (
    <div className="matrix-card p-6 rounded-xl">
      <h2 className="matrix-text text-2xl mb-4">Title</h2>
      <p className="text-green-300">Content</p>
    </div>
  );
};
```

## State Management

### Context Usage

```tsx
// Theme context example
const { isDark, toggleTheme } = useTheme();

// Apply theme classes
<div className={isDark ? 'dark' : 'light'}>
```

### API Integration

```tsx
// Service layer pattern
import { apiClient } from '../services/api';

const fetchData = async () => {
  try {
    const response = await apiClient.get('/endpoint');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

## Testing

### Unit Tests

```bash
# Run tests (when implemented)
npm test

# Test coverage
npm run test:coverage
```

### Manual Testing

1. **Responsive Design**: Test on mobile, tablet, desktop
2. **Theme Toggle**: Verify light/dark mode switching
3. **API Integration**: Test chat functionality
4. **Performance**: Check Lighthouse scores

## Contributing

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use meaningful component and variable names
- Add comments for complex logic

### Commit Messages

```bash
# Format: type(scope): description
feat(chat): add AI assistant functionality
fix(theme): resolve dark mode toggle issue
docs(readme): update deployment instructions
style(ui): improve mobile responsiveness
```

### Pull Request Process

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test locally
4. Commit with descriptive messages
5. Push to your fork: `git push origin feature/new-feature`
6. Create Pull Request with description

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Components are properly typed
- [ ] Responsive design works on all devices
- [ ] No console errors or warnings
- [ ] Performance impact is minimal
- [ ] Documentation is updated

## Deployment

### Local Testing

```bash
# Build and test production bundle
npm run build
npm run preview

# Test with local backend
sam local start-api --port 3001
```

### Staging Deployment

```bash
# Deploy to staging environment
sam deploy --parameter-overrides Environment=staging
```

### Production Deployment

```bash
# Deploy to production
sam deploy --parameter-overrides Environment=prod
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change dev server port in `vite.config.ts`
2. **API CORS**: Update CORS settings in Lambda functions
3. **Build errors**: Check TypeScript types and imports
4. **Theme issues**: Verify CSS variable definitions

### Debug Tools

- **React DevTools**: Component inspection
- **AWS CloudWatch**: Lambda function logs
- **Browser DevTools**: Network and console debugging
- **Lighthouse**: Performance auditing

## Performance Optimization

### Bundle Size

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

### Code Splitting

```tsx
// Lazy load components
const LazyComponent = lazy(() => import('./Component'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

### Image Optimization

- Use WebP format when possible
- Implement lazy loading for images
- Optimize image sizes for different devices

## Security

### Best Practices

- Never commit API keys or secrets
- Use environment variables for configuration
- Validate all user inputs
- Implement proper CORS policies
- Use HTTPS in production

### Security Checklist

- [ ] No hardcoded secrets in code
- [ ] Environment variables properly configured
- [ ] API endpoints have proper authentication
- [ ] CORS is configured correctly
- [ ] Input validation is implemented
