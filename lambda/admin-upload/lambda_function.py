import json
import boto3
import uuid
from datetime import datetime, timedelta
import os

s3_client = boto3.client('s3')
BUCKET_NAME = os.environ.get('CONTENT_BUCKET', 'your-portfolio-content')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD')
if not ADMIN_PASSWORD:
    raise ValueError("ADMIN_PASSWORD environment variable must be set")

def lambda_handler(event, context):
    try:
        # CORS headers
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
        }
        
        # Handle preflight requests
        if event['httpMethod'] == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': ''
            }
        
        # Parse request body
        body = json.loads(event['body'])
        
        # Simple authentication check (enhance with JWT in production)
        auth_header = event.get('headers', {}).get('Authorization', '')
        if not auth_header or auth_header != f'Bearer {ADMIN_PASSWORD}':
            return {
                'statusCode': 401,
                'headers': headers,
                'body': json.dumps({'error': 'Unauthorized'})
            }
        
        if event['httpMethod'] == 'POST':
            if event['pathParameters']['proxy'] == 'upload-url':
                return generate_upload_url(body, headers)
            elif event['pathParameters']['proxy'] == 'list-content':
                return list_content(headers)
            elif event['pathParameters']['proxy'] == 'update-status':
                return update_content_status(body, headers)
        
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

def generate_upload_url(body, headers):
    """Generate presigned URL for S3 upload"""
    file_name = body['fileName']
    file_type = body['fileType']
    content_type = body['contentType']
    
    # Generate unique file key
    file_extension = file_name.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    
    # Organize by content type
    s3_key = f"{content_type}s/{datetime.now().strftime('%Y/%m')}/{unique_filename}"
    
    # Generate presigned URL (expires in 1 hour)
    presigned_url = s3_client.generate_presigned_url(
        'put_object',
        Params={
            'Bucket': BUCKET_NAME,
            'Key': s3_key,
            'ContentType': file_type,
            'Metadata': {
                'original-name': file_name,
                'upload-date': datetime.now().isoformat(),
                'content-type': content_type
            }
        },
        ExpiresIn=3600
    )
    
    # File URL for accessing later
    file_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{s3_key}"
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'uploadUrl': presigned_url,
            'fileUrl': file_url,
            's3Key': s3_key
        })
    }

def list_content(headers):
    """List all content from S3 bucket"""
    try:
        response = s3_client.list_objects_v2(Bucket=BUCKET_NAME)
        
        content_items = []
        for obj in response.get('Contents', []):
            # Get object metadata
            metadata_response = s3_client.head_object(Bucket=BUCKET_NAME, Key=obj['Key'])
            metadata = metadata_response.get('Metadata', {})
            
            content_items.append({
                'id': obj['Key'],
                'title': metadata.get('original-name', obj['Key'].split('/')[-1]),
                'type': metadata.get('content-type', 'document'),
                'url': f"https://{BUCKET_NAME}.s3.amazonaws.com/{obj['Key']}",
                'uploadDate': metadata.get('upload-date', obj['LastModified'].isoformat()),
                'status': metadata.get('status', 'draft'),
                'size': obj['Size']
            })
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'content': content_items})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

def update_content_status(body, headers):
    """Update content status (draft/published)"""
    try:
        s3_key = body['s3Key']
        new_status = body['status']
        
        # Copy object with updated metadata
        copy_source = {'Bucket': BUCKET_NAME, 'Key': s3_key}
        
        # Get current metadata
        current_obj = s3_client.head_object(Bucket=BUCKET_NAME, Key=s3_key)
        current_metadata = current_obj.get('Metadata', {})
        
        # Update status
        current_metadata['status'] = new_status
        
        # Copy object with new metadata
        s3_client.copy_object(
            CopySource=copy_source,
            Bucket=BUCKET_NAME,
            Key=s3_key,
            Metadata=current_metadata,
            MetadataDirective='REPLACE'
        )
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'success': True})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
