import json
import boto3
import uuid
import hmac
import os
from datetime import datetime

s3_client = boto3.client('s3')
BUCKET_NAME = os.environ.get('CONTENT_BUCKET', 'your-portfolio-content')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD')
if not ADMIN_PASSWORD:
    raise ValueError("ADMIN_PASSWORD environment variable must be set")

ALLOWED_EXTENSIONS = {'md', 'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp'}
ALLOWED_CONTENT_TYPES = {
    'text/markdown', 'text/plain', 'application/pdf',
    'image/png', 'image/jpeg', 'image/gif', 'image/webp'
}


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
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    }


def _check_auth(event):
    """Constant-time password comparison to prevent timing attacks."""
    auth_header = (event.get('headers') or {}).get('Authorization', '')
    expected = f'Bearer {ADMIN_PASSWORD}'
    if not auth_header:
        return False
    return hmac.compare_digest(auth_header, expected)


def lambda_handler(event, context):
    headers = _get_cors_headers(event)
    try:
        # Handle preflight requests
        if event['httpMethod'] == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': ''
            }

        if not _check_auth(event):
            return {
                'statusCode': 401,
                'headers': headers,
                'body': json.dumps({'error': 'Unauthorized'})
            }

        # Parse request body
        body = json.loads(event['body'])

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
        print(f"Unhandled error: {e}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Internal server error'})
        }


def generate_upload_url(body, headers):
    """Generate presigned URL for S3 upload"""
    file_name = body['fileName']
    file_type = body['fileType']
    content_type = body['contentType']

    # Validate file extension
    file_extension = file_name.rsplit('.', 1)[-1].lower() if '.' in file_name else ''
    if not file_extension:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'File must have an extension'})
        }
    if file_extension not in ALLOWED_EXTENSIONS:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': f'File type .{file_extension} is not allowed'})
        }

    # Validate MIME type
    if file_type not in ALLOWED_CONTENT_TYPES:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Content type not allowed'})
        }

    # Generate unique file key
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
        print(f"list_content error: {e}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Internal server error'})
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
        print(f"update_content_status error: {e}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Internal server error'})
        }
