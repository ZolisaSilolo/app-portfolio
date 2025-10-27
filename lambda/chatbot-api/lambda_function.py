import json
import boto3
import cohere

def lambda_handler(event, context):
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    }
    
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        message = body.get('message', '')
        
        if not message or not isinstance(message, str):
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'error': 'Invalid message format'
                })
            }
        
        # Get Cohere API key from Secrets Manager
        secrets_client = boto3.client('secretsmanager')
        secret_response = secrets_client.get_secret_value(SecretId='portfolio-cohere-api-key')
        secret_data = json.loads(secret_response['SecretString'])
        api_key = secret_data['COHERE_API_KEY']
        
        # Initialize Cohere client
        co = cohere.ClientV2(api_key=api_key)
        
        # Portfolio context
        portfolio_context = """I am an AI assistant for a portfolio showcasing AWS and cloud engineering projects:

1. Simple AWS Fraud Detection Pipeline - MLOps project with Lambda, Kinesis, SageMaker
2. Awesome Environment With Backup & Disaster Recovery - AWS architecture with VPC, RDS, CloudFront
3. Just Serverless Efficiency (JSE) - Cloud-native vector store with Cohere API
4. Alexa Smart Home Skill - Voice control using Lambda and Alexa Skills Kit
5. Industrial Predictive Maintenance - ML-powered maintenance with AWS IoT and SageMaker

The portfolio demonstrates expertise in AWS services, serverless architecture, machine learning, and cloud-native development."""
        
        # Generate response using Cohere
        response = co.chat(
            model="command-r-plus-08-2024",
            messages=[
                {"role": "system", "content": portfolio_context},
                {"role": "user", "content": message}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'data': {
                    'response': response.message.content[0].text
                }
            })
        }
        
    except Exception as e:
        print(f"Chat API error: {e}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'error': 'Internal server error'
            })
        }
