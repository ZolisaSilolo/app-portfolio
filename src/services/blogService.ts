import { fetchAuthSession } from 'aws-amplify/auth';

const API_URL = import.meta.env.VITE_BLOG_API_URL || 'https://your-api-url.execute-api.us-east-1.amazonaws.com/prod';

async function getAuthHeaders() {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  } catch (error) {
    console.error('Auth error:', error);
    throw new Error('Authentication required');
  }
}

export interface BlogPost {
  id: string;
  title: string;
  status: 'draft' | 'published';
  uploadDate: string;
  size: number;
  s3Key: string;
}

export const blogService = {
  async getUploadUrl(filename: string, contentType: string = 'text/markdown') {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/blog/upload-url`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ filename, contentType })
    });
    
    if (!response.ok) throw new Error('Failed to get upload URL');
    return response.json();
  },

  async uploadFile(file: File) {
    // Get presigned URL
    const { uploadUrl, s3Key, fileUrl } = await this.getUploadUrl(file.name, file.type);
    
    // Upload to S3
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type }
    });
    
    if (!uploadResponse.ok) throw new Error('Failed to upload file');
    
    return { s3Key, fileUrl };
  },

  async listPosts(): Promise<BlogPost[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/blog/list`, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) throw new Error('Failed to list posts');
    const data = await response.json();
    return data.posts;
  },

  async publishPost(s3Key: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/blog/publish`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ s3Key })
    });
    
    if (!response.ok) throw new Error('Failed to publish post');
    return response.json();
  },

  async deletePost(s3Key: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/blog/delete`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ s3Key })
    });
    
    if (!response.ok) throw new Error('Failed to delete post');
    return response.json();
  }
};
