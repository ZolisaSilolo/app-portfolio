import json
import boto3
import uuid
from datetime import datetime
import os
import base64

s3 = boto3.client('s3')
cognito = boto3.client('cognito-idp')

BLOG_BUCKET = os.environ['BLOG_BUCKET']
USER_POOL_ID = os.environ['USER_POOL_ID']

def lambda_handler(event, context):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
        'Content-Type': 'application/json'
    }
    
    if event['httpMethod'] == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}
    
    try:
        # Verify admin access
        if not is_admin(event):
            return {'statusCode': 403, 'headers': headers, 'body': json.dumps({'error': 'Admin access required'})}
        
        path = event['path']
        method = event['httpMethod']
        
        if '/upload-url' in path and method == 'POST':
            return generate_upload_url(event, headers)
        elif '/list' in path and method == 'GET':
            return list_blog_posts(headers)
        elif '/publish' in path and method == 'POST':
            return publish_blog_post(event, headers)
        elif '/delete' in path and method == 'DELETE':
            return delete_blog_post(event, headers)
        
        return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Not found'})}
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': str(e)})}

def is_admin(event):
    """Verify user is in Admins group"""
    try:
        # Get user from Cognito authorizer claims
        claims = event.get('requestContext', {}).get('authorizer', {}).get('claims', {})
        username = claims.get('cognito:username')
        
        if not username:
            return False
        
        # Check if user is in Admins group
        response = cognito.admin_list_groups_for_user(
            Username=username,
            UserPoolId=USER_POOL_ID
        )
        
        groups = [g['GroupName'] for g in response.get('Groups', [])]
        return 'Admins' in groups
        
    except Exception as e:
        print(f"Admin check error: {str(e)}")
        return False

def generate_upload_url(event, headers):
    """Generate presigned URL for blog post upload"""
    body = json.loads(event['body'])
    filename = body['filename']
    content_type = body.get('contentType', 'text/markdown')
    
    # Generate unique key
    file_ext = filename.split('.')[-1]
    unique_id = str(uuid.uuid4())
    s3_key = f"drafts/{datetime.now().strftime('%Y/%m')}/{unique_id}.{file_ext}"
    
    # Generate presigned URL
    upload_url = s3.generate_presigned_url(
        'put_object',
        Params={
            'Bucket': BLOG_BUCKET,
            'Key': s3_key,
            'ContentType': content_type,
            'Metadata': {
                'original-filename': filename,
                'upload-date': datetime.now().isoformat(),
                'status': 'draft'
            }
        },
        ExpiresIn=3600
    )
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'uploadUrl': upload_url,
            's3Key': s3_key,
            'fileUrl': f"https://{BLOG_BUCKET}.s3.amazonaws.com/{s3_key}"
        })
    }

def list_blog_posts(headers):
    """List all blog posts (drafts and published)"""
    posts = []
    
    # List drafts
    drafts = s3.list_objects_v2(Bucket=BLOG_BUCKET, Prefix='drafts/')
    for obj in drafts.get('Contents', []):
        metadata = s3.head_object(Bucket=BLOG_BUCKET, Key=obj['Key'])
        posts.append({
            'id': obj['Key'],
            'title': metadata['Metadata'].get('original-filename', obj['Key'].split('/')[-1]),
            'status': 'draft',
            'uploadDate': obj['LastModified'].isoformat(),
            'size': obj['Size'],
            's3Key': obj['Key']
        })
    
    # List published
    published = s3.list_objects_v2(Bucket=BLOG_BUCKET, Prefix='published/')
    for obj in published.get('Contents', []):
        metadata = s3.head_object(Bucket=BLOG_BUCKET, Key=obj['Key'])
        posts.append({
            'id': obj['Key'],
            'title': metadata['Metadata'].get('original-filename', obj['Key'].split('/')[-1]),
            'status': 'published',
            'uploadDate': obj['LastModified'].isoformat(),
            'size': obj['Size'],
            's3Key': obj['Key']
        })
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'posts': posts})
    }

def publish_blog_post(event, headers):
    """Move blog post from drafts to published"""
    body = json.loads(event['body'])
    draft_key = body['s3Key']
    
    # Generate published key
    filename = draft_key.split('/')[-1]
    published_key = f"published/{filename}"
    
    # Copy to published folder
    s3.copy_object(
        CopySource={'Bucket': BLOG_BUCKET, 'Key': draft_key},
        Bucket=BLOG_BUCKET,
        Key=published_key,
        MetadataDirective='COPY'
    )
    
    # Delete draft
    s3.delete_object(Bucket=BLOG_BUCKET, Key=draft_key)
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'success': True,
            'publishedKey': published_key,
            'url': f"https://{BLOG_BUCKET}.s3.amazonaws.com/{published_key}"
        })
    }

def delete_blog_post(event, headers):
    """Delete blog post"""
    body = json.loads(event['body'])
    s3_key = body['s3Key']
    
    s3.delete_object(Bucket=BLOG_BUCKET, Key=s3_key)
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'success': True})
    }
