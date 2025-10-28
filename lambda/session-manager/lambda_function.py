import json
import boto3
import uuid
from datetime import datetime, timedelta
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ.get('SESSION_TABLE', 'portfolio-sessions'))

def lambda_handler(event, context):
    try:
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
        }
        
        if event['httpMethod'] == 'OPTIONS':
            return {'statusCode': 200, 'headers': headers, 'body': ''}
        
        method = event['httpMethod']
        path = event['pathParameters']['proxy'] if event.get('pathParameters') else ''
        body = json.loads(event.get('body', '{}'))
        
        if method == 'POST':
            if path == 'create':
                return create_session(body, headers)
            elif path == 'update':
                return update_session(body, headers)
            elif path == 'analytics':
                return log_analytics(body, headers)
        elif method == 'GET':
            if path == 'validate':
                return validate_session(event['queryStringParameters'], headers)
            elif path == 'analytics':
                return get_analytics(event['queryStringParameters'], headers)
        elif method == 'DELETE':
            if path == 'logout':
                return delete_session(body, headers)
                
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': 'Not found'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

def create_session(body, headers):
    """Create new session with analytics tracking"""
    user_id = body['userId']
    email = body['email']
    is_admin = body.get('isAdmin', False)
    
    session_id = str(uuid.uuid4())
    now = datetime.utcnow()
    expires_at = now + timedelta(days=30)  # 30-day session
    
    session_data = {
        'sessionId': session_id,
        'userId': user_id,
        'email': email,
        'isAdmin': is_admin,
        'createdAt': now.isoformat(),
        'expiresAt': expires_at.isoformat(),
        'lastActivity': now.isoformat(),
        'loginCount': 1,
        'userAgent': body.get('userAgent', ''),
        'ipAddress': body.get('ipAddress', ''),
        'deviceType': get_device_type(body.get('userAgent', '')),
        'ttl': int(expires_at.timestamp())
    }
    
    table.put_item(Item=session_data)
    
    # Log analytics event
    log_event('login', user_id, {
        'sessionId': session_id,
        'isAdmin': is_admin,
        'deviceType': session_data['deviceType']
    })
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'sessionId': session_id,
            'expiresAt': expires_at.isoformat()
        })
    }

def validate_session(params, headers):
    """Validate session and update last activity"""
    session_id = params.get('sessionId')
    
    if not session_id:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Session ID required'})
        }
    
    try:
        response = table.get_item(Key={'sessionId': session_id})
        
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'valid': False, 'error': 'Session not found'})
            }
        
        session = response['Item']
        now = datetime.utcnow()
        expires_at = datetime.fromisoformat(session['expiresAt'])
        
        if now > expires_at:
            # Session expired, delete it
            table.delete_item(Key={'sessionId': session_id})
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'valid': False, 'error': 'Session expired'})
            }
        
        # Update last activity
        table.update_item(
            Key={'sessionId': session_id},
            UpdateExpression='SET lastActivity = :now',
            ExpressionAttributeValues={':now': now.isoformat()}
        )
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'valid': True,
                'userId': session['userId'],
                'email': session['email'],
                'isAdmin': session['isAdmin']
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

def update_session(body, headers):
    """Update session metadata"""
    session_id = body['sessionId']
    updates = body.get('updates', {})
    
    update_expression = []
    expression_values = {}
    
    for key, value in updates.items():
        if key in ['lastActivity', 'loginCount', 'userAgent', 'ipAddress']:
            update_expression.append(f"{key} = :{key}")
            expression_values[f":{key}"] = value
    
    if update_expression:
        table.update_item(
            Key={'sessionId': session_id},
            UpdateExpression='SET ' + ', '.join(update_expression),
            ExpressionAttributeValues=expression_values
        )
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'success': True})
    }

def delete_session(body, headers):
    """Delete session (logout)"""
    session_id = body['sessionId']
    user_id = body.get('userId')
    
    table.delete_item(Key={'sessionId': session_id})
    
    # Log analytics event
    if user_id:
        log_event('logout', user_id, {'sessionId': session_id})
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'success': True})
    }

def log_analytics(body, headers):
    """Log analytics event"""
    event_type = body['eventType']
    user_id = body['userId']
    metadata = body.get('metadata', {})
    
    log_event(event_type, user_id, metadata)
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'success': True})
    }

def get_analytics(params, headers):
    """Get analytics data"""
    user_id = params.get('userId')
    event_type = params.get('eventType')
    
    # Query analytics events (you'd implement based on your analytics table structure)
    # This is a simplified version
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'analytics': 'Analytics data would be returned here'
        })
    }

def log_event(event_type, user_id, metadata):
    """Log analytics event to separate analytics table/partition"""
    analytics_table = dynamodb.Table(os.environ.get('ANALYTICS_TABLE', 'portfolio-analytics'))
    
    event_data = {
        'eventId': str(uuid.uuid4()),
        'eventType': event_type,
        'userId': user_id,
        'timestamp': datetime.utcnow().isoformat(),
        'metadata': metadata,
        'ttl': int((datetime.utcnow() + timedelta(days=365)).timestamp())  # Keep for 1 year
    }
    
    analytics_table.put_item(Item=event_data)

def get_device_type(user_agent):
    """Determine device type from user agent"""
    user_agent = user_agent.lower()
    if 'mobile' in user_agent or 'android' in user_agent or 'iphone' in user_agent:
        return 'mobile'
    elif 'tablet' in user_agent or 'ipad' in user_agent:
        return 'tablet'
    else:
        return 'desktop'
