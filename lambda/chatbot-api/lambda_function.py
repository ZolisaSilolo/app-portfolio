import json

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
        
        # Mock response for testing
        mock_response = f"""Hello! I'm the AI assistant for this portfolio. I can tell you about the following projects:

1. **Simple AWS Fraud Detection Pipeline** - An MLOps project showcasing skills in building scalable real-world solutions using AWS Lambda, Kinesis, SageMaker, and more.

2. **Awesome Environment With Backup & Disaster Recovery** - A comprehensive AWS architecture with VPC, RDS, CloudFront, and disaster recovery capabilities.

3. **Just Serverless Efficiency (JSE)** - A cloud-native vector store application leveraging Cohere's API for document processing and text summarization.

4. **Alexa Smart Home Skill** - Voice-controlled smart device management using AWS Lambda and Alexa Skills Kit.

5. **Industrial Predictive Maintenance** - ML-powered predictive maintenance for industrial equipment using AWS IoT and SageMaker.

You asked: "{message}"

What would you like to know more about?"""
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'data': {
                    'response': mock_response
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
