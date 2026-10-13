import json
import os

import boto3
from botocore.config import Config

# Amazon Nova 2 Lite via US cross-region inference profile (low cost, fast).
MODEL_ID = os.environ.get("BEDROCK_MODEL_ID", "us.amazon.nova-2-lite-v1:0")
MESSAGE_MAX_LENGTH = 1000
ALLOWED_ORIGIN = os.environ.get("CORS_ORIGIN", "*")

PORTFOLIO_CONTEXT = """You are the portfolio assistant for Zolisa Silolo, a Cloud & AI Solutions Architect based in Johannesburg, South Africa (contact: zolisasilolo@gmail.com, GitHub: github.com/ZolisaSilolo).

Featured projects:
1. Serverless Portfolio System - React/TypeScript frontend on AWS Amplify, Lambda + API Gateway backend, Amazon Bedrock chatbot, CI/CD with GitHub Actions, CloudFormation/SAM.
2. AI Data Analytics Agent - Amazon Bedrock, SageMaker and Pandas automating exploratory data analysis (70% faster analysis).
3. Fraud Detection System - SageMaker anomaly detection with Kinesis, Lambda, DynamoDB, SNS (92% accuracy, 35% fewer false positives).
4. JustServerlessEfficiency (JSE) - Intelligent document processing with Lambda, Step Functions and Bedrock (60% less manual processing).
5. Cloud Infrastructure with Disaster Recovery - custom VPC, Auto Scaling, Multi-AZ RDS, DynamoDB, S3 + CloudFront, Route 53, WAF, AWS Backup.
6. Alexa Smart Home Skill and Industrial Predictive Maintenance (AWS IoT + SageMaker).

Answer concisely (under 150 words), in a friendly professional tone, only about Zolisa's skills, projects, experience and how to collaborate. If you don't know something, say so and suggest contacting Zolisa directly."""

_bedrock = boto3.client(
    "bedrock-runtime",
    config=Config(read_timeout=25, retries={"max_attempts": 2, "mode": "standard"}),
)

HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
}


def _resp(status, body):
    return {"statusCode": status, "headers": HEADERS, "body": json.dumps(body)}


def lambda_handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": HEADERS, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return _resp(400, {"success": False, "error": "Invalid JSON"})

    message = body.get("message")
    if not isinstance(message, str) or not message.strip():
        return _resp(400, {"success": False, "error": "Invalid message format"})
    if len(message) > MESSAGE_MAX_LENGTH:
        return _resp(400, {"success": False, "error": "Message too long"})

    try:
        result = _bedrock.converse(
            modelId=MODEL_ID,
            system=[{"text": PORTFOLIO_CONTEXT}],
            messages=[{"role": "user", "content": [{"text": message.strip()}]}],
            inferenceConfig={"maxTokens": 400, "temperature": 0.3, "topP": 0.9},
        )
        text = result["output"]["message"]["content"][0]["text"]
        return _resp(200, {"success": True, "data": {"response": text}})
    except Exception as e:  # noqa: BLE001 - log and return generic error
        print(f"Bedrock error: {e}")
        return _resp(502, {"success": False, "error": "Chat service unavailable"})
