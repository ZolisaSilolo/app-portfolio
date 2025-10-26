const PORTFOLIO_PROJECTS = [
  {
    title: "Simple AWS Fraud Detection Pipeline",
    description: "This is an MLOps project that showcases my skills in building and deploying scalable real-world solutions using AWS services.",
    technologies: ["AWS Lambda", "Amazon Kinesis", "Amazon SageMaker", "SNS Topic", "DynamoDB", "API Gateway", "S3"],
    repo_url: "https://github.com/ZolisaSilolo/Simple-AWS-Fraud-Detection-Pipeline",
    emoji: "🔍💳🛠️🚫🏴‍☠️"
  },
  {
    title: "Awesome Environment With Backup & Disaster Recovery",
    description: "Architecting a custom VPC with public and private subnets, Internet & NAT Gateways for controlled access, an EC2 Auto Scaling Group with ELB for scalability, Multi-AZ RDS and DynamoDB for databases, S3 with CloudFront for storage and delivery, Route 53 for DNS, WAF & NACLs for security, VPC Peering for cross-region traffic, and AWS Backup for automation and resilience.",
    technologies: ["VPC", "RDS", "Cloudfront", "Cloudformation", "S3", "Route 53", "WAF", "NACLs", "VPC Peering", "AWS Backup"],
    repo_url: "https://github.com/ZolisaSilolo/awesome-environment",
    emoji: "☁️🔄🌐"
  },
  {
    title: "Just Serveless Efficiency (JSE)",
    description: "A web application with a cloud-native vector store that leverages Cohere's API to generate and analyze content for Document Processing, Text summarisation, and more.",
    technologies: ["Python", "Cohere API", "FastAPI", "Streamlit", "AWS Lambda", "S3", "API Gateway", "OpenSearchServerless"],
    repo_url: "https://github.com/ZolisaSilolo/JustServelessEfficiency-JSE",
    emoji: "⚡🤖📊"
  },
  {
    title: "Alexa Smart Home Skill",
    description: "An Alexa Smart Home Skill that allows users to control smart devices using voice commands.",
    technologies: ["AWS Lambda", "Alexa Skills Kit", "DynamoDB", "API Gateway"],
    repo_url: "https://github.com/ZolisaSilolo/alexa-smart-home",
    emoji: "🏡🤖"
  },
  {
    title: "Industrial Predictive Maintenance",
    description: "A predictive maintenance solution for industrial equipment using machine learning and IoT sensors.",
    technologies: ["Python", "AWS IoT", "Amazon SageMaker", "AWS Lambda"],
    repo_url: "https://github.com/ZolisaSilolo/Industrial-Predictive-Maintenance",
    emoji: "🚨💻🚧🔨🚜"
  }
];

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: PORTFOLIO_PROJECTS
      })
    };
  } catch (error) {
    console.error('Portfolio API error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      })
    };
  }
};