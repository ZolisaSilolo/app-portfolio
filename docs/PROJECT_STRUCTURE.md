# Project Structure

## Root Directory

```
portfolio/
├── src/                    # Frontend source code
├── deployment/             # Deployment scripts and templates
├── lambda/                 # AWS Lambda functions
├── public/                 # Static assets
├── docs/                   # Documentation
├── package.json            # Node.js dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── amplify.yml             # AWS Amplify build settings
└── README.md               # Main documentation
```

## Source Code (`src/`)

```
src/
├── components/             # Reusable React components
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Loading.tsx
│   ├── Login.tsx
│   └── PublicAuth.tsx
├── contexts/               # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── ThemeContext.tsx   # Theme management
├── data/                   # Static data and content
│   ├── blogPosts.ts       # Blog content
│   └── projects.ts        # Portfolio projects
├── hooks/                  # Custom React hooks
│   └── useChat.ts         # Chat functionality
├── pages/                  # Page components
│   ├── About.tsx          # About page
│   ├── Admin.tsx          # Admin panel
│   ├── Blog.tsx           # Blog listing
│   ├── BlogPost.tsx       # Individual blog post
│   ├── Chat.tsx           # AI chat interface
│   ├── Home.tsx           # Landing page
│   └── Portfolio.tsx      # Projects showcase
├── services/               # API service layers
│   └── api.ts             # API communication
├── types/                  # TypeScript type definitions
│   └── index.ts           # Shared types
├── App.tsx                 # Main app component
├── main.tsx               # Application entry point
├── index.css              # Global styles
├── amplifyconfiguration.json # AWS Amplify config
└── vite-env.d.ts          # Vite environment types
```

## Deployment (`deployment/`)

```
deployment/
├── cognito-simple.yaml     # Cognito User Pool CloudFormation
├── template.yaml           # SAM backend template
├── deploy-cognito.sh       # Cognito deployment script
├── deploy.sh               # Backend deployment script
└── README.md               # Deployment documentation
```

## Lambda Functions (`lambda/`)

```
lambda/
├── chatbot-api/            # AI chatbot Lambda
├── portfolio-api/          # Portfolio data API
└── health-check/           # Health check endpoint
```

## Public Assets (`public/`)

```
public/
├── favicon.svg             # Site favicon
├── profile.jpg             # Profile image
├── THUMBNAIL_IMAGE.jpg     # Blog thumbnail
├── WELL-ARCHITECTED.jpg    # Certification badge
└── *.jpg                   # Other certification images
```

## Key Files

- **`package.json`**: Node.js dependencies and scripts
- **`tsconfig.json`**: TypeScript compiler configuration
- **`vite.config.ts`**: Vite build tool configuration
- **`tailwind.config.js`**: Tailwind CSS framework setup
- **`amplify.yml`**: AWS Amplify build and deployment settings
- **`.env.example`**: Environment variable template
- **`.gitignore`**: Git ignore patterns
- **`LICENSE`**: MIT license file
