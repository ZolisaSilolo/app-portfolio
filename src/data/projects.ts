import { Project } from '../types';

export const projects: Project[] = [
  {
    title: "Matrix-Themed Portfolio System",
    description: "A full-stack serverless portfolio application featuring React frontend with TypeScript, AWS Lambda backend with AI-powered chatbot using Cohere, automated CI/CD via GitHub Actions and AWS Amplify, comprehensive security with API Gateway usage plans, rate limiting, and AWS Secrets Manager integration. Includes complete infrastructure as code with CloudFormation templates.",
    technologies: ["React", "TypeScript", "AWS Lambda", "API Gateway", "AWS Amplify", "Cohere AI", "CloudFormation", "GitHub Actions", "AWS Secrets Manager", "CloudWatch"],
    repo_url: "https://github.com/ZolisaSilolo/app-portfolio/tree/new-react-client",
    live_url: "https://zolisasilolo.co.za",
    emoji: "🎬⚡🌐",
    icon: "globe"
  },
  {
    title: "AI Data Analytics Agent",
    description: "Built an intelligent agent leveraging Pandas, Bedrock, and SageMaker to automate exploratory data analysis (EDA), reducing analysis time by 70% and enabling faster business insights.",
    technologies: ["Amazon Bedrock", "Amazon SageMaker", "Python", "Pandas", "AWS Lambda", "API Gateway"],
    repo_url: "https://github.com/ZolisaSilolo/ai-data-analytics-agent",
    emoji: "🤖📊⚡",
    icon: "zap"
  },
  {
    title: "Fraud Detection System",
    description: "Developed a fraud detection pipeline using AWS SageMaker and anomaly detection algorithms, reducing false positives by 35% and detecting fraudulent transactions with 92% accuracy.",
    technologies: ["AWS SageMaker", "Amazon Kinesis", "AWS Lambda", "DynamoDB", "SNS", "CloudWatch"],
    repo_url: "https://github.com/ZolisaSilolo/Simple-AWS-Fraud-Detection-Pipeline",
    emoji: "🔍💳🛡️",
    icon: "shield"
  },
  {
    title: "JustServerlessEfficiency (JSE) - Intelligent Document Processing",
    description: "Designed a serverless solution with AWS Lambda, Step Functions, and Bedrock to automate document ingestion and classification, cutting manual processing by 60% and improving accuracy to 95%.",
    technologies: ["AWS Lambda", "Step Functions", "Amazon Bedrock", "S3", "API Gateway", "DynamoDB"],
    repo_url: "https://github.com/ZolisaSilolo/JustServelessEfficiency-JSE",
    emoji: "📄🤖⚡",
    icon: "file-text"
  },
  {
    title: "Cloud Infrastructure with Disaster Recovery",
    description: "Architected a custom VPC with public and private subnets, Internet & NAT Gateways for controlled access, an EC2 Auto Scaling Group with ELB for scalability, Multi-AZ RDS and DynamoDB for databases, S3 with CloudFront for storage and delivery.",
    technologies: ["VPC", "RDS", "CloudFront", "CloudFormation", "S3", "Route 53", "WAF", "NACLs", "VPC Peering", "AWS Backup"],
    repo_url: "https://github.com/ZolisaSilolo/awesome-environment",
    emoji: "☁️🔄🌐",
    icon: "cloud"
  },
  {
    title: "Industrial Predictive Maintenance",
    description: "A predictive maintenance solution for industrial equipment using machine learning and IoT sensors, leveraging AWS IoT Core and SageMaker for real-time monitoring and predictive analytics.",
    technologies: ["AWS IoT Core", "Amazon SageMaker", "AWS Lambda", "DynamoDB", "CloudWatch", "Python"],
    repo_url: "https://github.com/ZolisaSilolo/Industrial-Predictive-Maintenance",
    emoji: "🏭🔧📊",
    icon: "wrench"
  }
];
