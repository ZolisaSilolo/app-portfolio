import json
import boto3
import uuid
import os
from datetime import datetime, timedelta

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ.get('SESSION_TABLE', 'portfolio-sessions'))

SESSION_DURATION_DAYS = 7  # Reduced from 30 days for better security


def _get_cors_headers(event):
    allowed_origin = os.environ.get('CORS_ORIGIN', '')
    request_origin = (event.get('headers') or {}).get('origin') or \
                     (event.get('headers') or {}).get('Origin') or ''
    if allowed_origin:
        cors_origin = allowed_origin if request_origin == allowed_origin else 'null'
    else:
        cors_origin = request_origin or '*'
    return {
        'Access-Control-Allow-Origin': cors_origin,
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    }


def lambda_handler(event, context):
    headers = _get_cors_headers(event)

    try:
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
        print(f"Unhandled error: {e}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Internal server error'})
        }


def create_session(body, headers):
    """Create new session with analytics tracking"""
    user_id = body['userId']
    email = body['email']
    is_admin = body.get('isAdmin', False)

    session_id = str(uuid.uuid4())
    now = datetime.utcnow()
    expires_at = now + timedelta(days=SESSION_DURATION_DAYS)

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
            table.delete_item(Key={'sessionId': session_id})
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'valid': False, 'error': 'Session expired'})
            }

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
        print(f"validate_session error: {e}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Internal server error'})
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
        'ttl': int((datetime.utcnow() + timedelta(days=365)).timestamp())
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
