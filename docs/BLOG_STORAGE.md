# Blog Storage System with S3 Integration

## Overview

Automated blog content management system using AWS S3, Lambda, and API Gateway with Cognito authentication.

## Architecture

```
Admin User (Cognito Auth)
    ↓
Frontend (React + blogService)
    ↓
API Gateway (Cognito Authorizer)
    ↓
Lambda Function (Admin Check)
    ↓
S3 Bucket (drafts/ & published/)
```

## Features

✅ **Secure Upload**: Presigned URLs for direct S3 uploads
✅ **Admin-Only Access**: Cognito group-based authorization
✅ **Draft/Published Workflow**: Separate folders for content states
✅ **Automatic Organization**: Date-based folder structure
✅ **Public Read Access**: Published content is publicly accessible
✅ **Version Control**: S3 versioning enabled

## Deployment

### 1. Deploy Infrastructure

```bash
./deployment/deploy-blog-storage.sh
```

This creates:
- S3 bucket for blog content
- Lambda function for admin operations
- API Gateway with Cognito authorizer
- IAM roles and policies

### 2. Configure Frontend

Add to `.env`:
```
VITE_BLOG_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
```

### 3. Rebuild and Deploy

```bash
npm run build
# Deploy to Amplify via GitHub push
```

## Usage

### Admin Panel

1. Navigate to `/admin`
2. Login with admin credentials
3. Upload markdown files (.md, .txt)
4. Posts start as "drafts"
5. Click ✓ to publish (moves to published/)
6. Click 🗑️ to delete

### API Endpoints

**POST /admin/blog/upload-url**
- Generate presigned URL for upload
- Returns: `{uploadUrl, s3Key, fileUrl}`

**GET /admin/blog/list**
- List all blog posts (drafts + published)
- Returns: `{posts: [{id, title, status, uploadDate, size, s3Key}]}`

**POST /admin/blog/publish**
- Move post from drafts/ to published/
- Body: `{s3Key}`

**DELETE /admin/blog/delete**
- Delete blog post
- Body: `{s3Key}`

## S3 Bucket Structure

```
portfolio-blog-storage-blog-content/
├── drafts/
│   └── 2025/
│       └── 10/
│           └── uuid.md
└── published/
    └── uuid.md
```

## Security

- **Authentication**: AWS Cognito JWT tokens
- **Authorization**: Admin group membership required
- **S3 Access**: 
  - Drafts: Private (admin only)
  - Published: Public read access
- **Presigned URLs**: 1-hour expiration

## Frontend Integration

```typescript
import { blogService } from '../services/blogService';

// Upload file
const { s3Key, fileUrl } = await blogService.uploadFile(file);

// List posts
const posts = await blogService.listPosts();

// Publish post
await blogService.publishPost(s3Key);

// Delete post
await blogService.deletePost(s3Key);
```

## Automation Features

1. **Auto-Organization**: Files organized by upload date
2. **Metadata Tracking**: Original filename, upload date, status
3. **Version Control**: S3 versioning for rollback capability
4. **CORS Enabled**: Direct browser uploads
5. **Public CDN**: Published content served via S3 URL

## Cost Optimization

- **S3 Standard**: $0.023/GB/month
- **Lambda**: Free tier covers most usage
- **API Gateway**: $3.50/million requests
- **Estimated**: <$5/month for typical blog usage

## Troubleshooting

**Upload fails with 403**
- Check Cognito token is valid
- Verify user is in Admins group

**Can't see published posts**
- Check S3 bucket policy allows public read
- Verify file is in published/ folder

**API returns 401**
- Refresh authentication token
- Re-login to admin panel

## Future Enhancements

- [ ] Markdown preview before publish
- [ ] Image upload support
- [ ] SEO metadata fields
- [ ] Scheduled publishing
- [ ] Content analytics
- [ ] CloudFront CDN integration
