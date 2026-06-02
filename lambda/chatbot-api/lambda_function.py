import json
import os
import boto3
import requests

NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
MODEL = "nvidia/nemotron-mini-4b-instruct"
SECRET_NAME = os.environ.get("NVIDIA_SECRET_NAME", "portfolio-nvidia-api-key")

PORTFOLIO_CONTEXT = """I am an AI assistant for a portfolio showcasing AWS and cloud engineering projects:

1. Simple AWS Fraud Detection Pipeline - MLOps project with Lambda, Kinesis, SageMaker
2. Awesome Environment With Backup & Disaster Recovery - AWS architecture with VPC, RDS, CloudFront
3. Just Serverless Efficiency (JSE) - Cloud-native vector store with Cohere API
4. Alexa Smart Home Skill - Voice control using Lambda and Alexa Skills Kit
5. Industrial Predictive Maintenance - ML-powered maintenance with AWS IoT and SageMaker

The portfolio demonstrates expertise in AWS services, serverless architecture, machine learning, and cloud-native development."""

_api_key = None


def _get_api_key():
    global _api_key
    if not _api_key:
        secret = boto3.client("secretsmanager").get_secret_value(SecretId=SECRET_NAME)["SecretString"]
        try:
            _api_key = json.loads(secret).get("NVIDIA_API_KEY", secret)
        except json.JSONDecodeError:
            _api_key = secret
    return _api_key


def lambda_handler(event, context):
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    try:
        body = json.loads(event.get('body', '{}'))
        message = body.get('message', '')

        if not message or not isinstance(message, str):
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'success': False, 'error': 'Invalid message format'})
            }

        resp = requests.post(
            NVIDIA_URL,
            headers={'Authorization': f'Bearer {_get_api_key()}', 'Content-Type': 'application/json'},
            json={
                'model': MODEL,
                'messages': [
                    {'role': 'system', 'content': PORTFOLIO_CONTEXT},
                    {'role': 'user', 'content': message}
                ],
                'temperature': 0.2,
                'top_p': 0.7,
                'max_tokens': 1024,
                'stream': False
            },
            timeout=25
        )
        resp.raise_for_status()
        text = resp.json()['choices'][0]['message']['content']

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'success': True, 'data': {'response': text}})
        }

    except Exception as e:
        print(f"Chat API error: {e}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'success': False, 'error': 'Internal server error'})
        }
