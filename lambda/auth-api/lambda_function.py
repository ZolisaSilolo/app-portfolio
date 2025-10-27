import json
import uuid
import re

def lambda_handler(event, context):
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
    }
    
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        fingerprint = body.get('fingerprint', '')
        
        # Validate fingerprint format
        if not fingerprint or not isinstance(fingerprint, str):
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'error': 'Invalid fingerprint format'
                })
            }
        
        # Basic validation - should be base64-like string
        if not re.match(r'^[A-Za-z0-9+/=]{8,32}$', fingerprint):
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'error': 'Invalid fingerprint format'
                })
            }
        
        session_id = str(uuid.uuid4())
        
        # For testing, return a mock token
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'data': {
                    'sessionId': session_id,
                    'accessToken': 'mock-access-token-for-testing',
                    'idToken': 'mock-id-token-for-testing',
                    'expiresIn': 3600
                }
            })
        }
        
    except Exception as e:
        print(f"Auth error: {e}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'error': 'Authentication failed'
            })
        }
