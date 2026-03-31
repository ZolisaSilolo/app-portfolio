const { CohereClient } = require('cohere-ai');
const AWS = require('aws-sdk');

const secretsManager = new AWS.SecretsManager();
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Rate limiting configuration
const RATE_LIMITS = {
  requests_per_hour: 20,
  requests_per_day: 100
};

// Portfolio context for the chatbot
const PORTFOLIO_CONTEXT = `
Portfolio Projects:
- Simple AWS Fraud Detection Pipeline: MLOps project showcasing skills in building and deploying scalable real-world solutions using AWS services. (Tech stack: AWS Lambda, Amazon Kinesis, Amazon SageMaker, SNS Topic, DynamoDB, API Gateway, S3)
- Awesome Environment With Backup & Disaster Recovery: Architecting a custom VPC with public and private subnets, Internet & NAT Gateways for controlled access, an EC2 Auto Scaling Group with ELB for scalability, Multi-AZ RDS and DynamoDB for databases, S3 with CloudFront for storage and delivery, Route 53 for DNS, WAF & NACLs for security, VPC Peering for cross-region traffic, and AWS Backup for automation and resilience. (Tech stack: VPC, RDS, Cloudfront, Cloudformation, S3, Route 53, WAF, NACLs, VPC Peering, AWS Backup)
- Just Serveless Efficiency (JSE): A web application with a cloud-native vector store that leverages Cohere's API to generate and analyze content for Document Processing, Text summarisation, and more. (Tech stack: Python, Cohere API, FastAPI, Streamlit, AWS Lambda, S3, API Gateway, OpenSearchServerless)
- Alexa Smart Home Skill: An Alexa Smart Home Skill that allows users to control smart devices using voice commands. (Tech stack: AWS Lambda, Alexa Skills Kit, DynamoDB, API Gateway)
- Industrial Predictive Maintenance: A predictive maintenance solution for industrial equipment using machine learning and IoT sensors. (Tech stack: Python, AWS IoT, Amazon SageMaker, AWS Lambda)

GitHub: https://github.com/ZolisaSilolo
`;

let cohereClient = null;

async function getCohereClient() {
  if (!cohereClient) {
    try {
      const secretName = process.env.COHERE_SECRET_NAME || 'portfolio-cohere-api-key';
      const secret = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
      const secretData = JSON.parse(secret.SecretString);
      
      cohereClient = new CohereClient({
        token: secretData.COHERE_API_KEY,
      });
      
      console.log('Cohere client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Cohere client:', error);
      throw new Error('Failed to initialize chat service');
    }
  }
  return cohereClient;
}

const MESSAGE_MAX_LENGTH = 1000;

async function checkRateLimit(userId) {
  const rateLimitTable = process.env.RATE_LIMIT_TABLE || 'portfolio-rate-limits';
  const now = Date.now();
  const hourWindow = Math.floor(now / 3600000);
  const dayWindow = Math.floor(now / 86400000);
  const hourKey = `${userId}#hour#${hourWindow}`;
  const dayKey = `${userId}#day#${dayWindow}`;

  try {
    const [hourResult, dayResult] = await Promise.all([
      dynamodb.get({ TableName: rateLimitTable, Key: { pk: hourKey } }).promise(),
      dynamodb.get({ TableName: rateLimitTable, Key: { pk: dayKey } }).promise(),
    ]);

    const hourCount = hourResult.Item ? hourResult.Item.count : 0;
    const dayCount = dayResult.Item ? dayResult.Item.count : 0;

    if (hourCount >= RATE_LIMITS.requests_per_hour) {
      return { allowed: false, reason: 'Hourly request limit exceeded. Please try again later.' };
    }
    if (dayCount >= RATE_LIMITS.requests_per_day) {
      return { allowed: false, reason: 'Daily request limit exceeded. Please try again tomorrow.' };
    }

    // Increment counters atomically
    await Promise.all([
      dynamodb.update({
        TableName: rateLimitTable,
        Key: { pk: hourKey },
        UpdateExpression: 'ADD #c :inc SET #ttl = :ttl',
        ExpressionAttributeNames: { '#c': 'count', '#ttl': 'ttl' },
        ExpressionAttributeValues: { ':inc': 1, ':ttl': Math.floor(now / 1000) + 7200 },
      }).promise(),
      dynamodb.update({
        TableName: rateLimitTable,
        Key: { pk: dayKey },
        UpdateExpression: 'ADD #c :inc SET #ttl = :ttl',
        ExpressionAttributeNames: { '#c': 'count', '#ttl': 'ttl' },
        ExpressionAttributeValues: { ':inc': 1, ':ttl': Math.floor(now / 1000) + 172800 },
      }).promise(),
    ]);

    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open only in development; in production you may want to fail closed
    return { allowed: true };
  }
}

function getUserIdFromToken(event) {
  try {
    // For testing without auth, use a default user ID
    const token = event.requestContext?.authorizer?.claims?.sub;
    if (!token) {
      return 'guest-user-' + Date.now(); // Return a default guest user ID
    }
    return token;
  } catch (error) {
    console.error('Failed to extract user ID:', error);
    return 'guest-user-' + Date.now(); // Return a default guest user ID
  }
}

exports.handler = async (event) => {
  const allowedOrigin = process.env.CORS_ORIGIN || '';
  const requestOrigin = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
  const corsOrigin = allowedOrigin
    ? (requestOrigin === allowedOrigin ? allowedOrigin : 'null')
    : requestOrigin || '*';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const userId = getUserIdFromToken(event);
    const { message } = JSON.parse(event.body);
    
    if (!message || typeof message !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Message is required and must be a string'
        })
      };
    }

    if (message.length > MESSAGE_MAX_LENGTH) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Message must not exceed ${MESSAGE_MAX_LENGTH} characters`
        })
      };
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(userId);
    if (!rateLimitResult.allowed) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({
          success: false,
          error: rateLimitResult.reason || 'Rate limit exceeded'
        })
      };
    }

    const cohere = await getCohereClient();
    
    const systemPrompt = `You are a helpful assistant for Lundi Zolisa Silolo's portfolio website. You can talk about their projects and skills in a humorous yet professional way. Here's the context about Lundi's work: ${PORTFOLIO_CONTEXT}`;
    
    const response = await cohere.chat({
      message: message,
      model: 'command-r-plus',
      temperature: 0.7,
      preamble: systemPrompt,
      maxTokens: 250
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          text: response.text
        }
      })
    };

  } catch (error) {
    console.error('Chat API error:', error);
    
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
