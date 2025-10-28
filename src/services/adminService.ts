const ADMIN_API_BASE = process.env.REACT_APP_ADMIN_API_URL || 'https://your-admin-api.execute-api.us-east-1.amazonaws.com/prod';
const ADMIN_PASSWORD = 'ZolisaAdmin2025!'; // This should match your Lambda environment variable

export interface ContentItem {
  id: string;
  title: string;
  type: 'blog' | 'image' | 'video' | 'audio' | 'document';
  url: string;
  uploadDate: string;
  status: 'draft' | 'published';
  size?: number;
}

class AdminService {
  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_PASSWORD}`
    };
  }

  async generateUploadUrl(fileName: string, fileType: string, contentType: string) {
    const response = await fetch(`${ADMIN_API_BASE}/admin/upload-url`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        fileName,
        fileType,
        contentType
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate upload URL');
    }

    return response.json();
  }

  async uploadFile(file: File, uploadUrl: string) {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return response;
  }

  async listContent(): Promise<ContentItem[]> {
    const response = await fetch(`${ADMIN_API_BASE}/admin/list-content`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to list content');
    }

    const data = await response.json();
    return data.content;
  }

  async updateContentStatus(s3Key: string, status: 'draft' | 'published') {
    const response = await fetch(`${ADMIN_API_BASE}/admin/update-status`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        s3Key,
        status
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update content status');
    }

    return response.json();
  }

  async uploadBlogPost(title: string, content: string, category: string, tags: string[]) {
    // Create markdown content
    const markdownContent = `---
title: ${title}
date: ${new Date().toISOString().split('T')[0]}
category: ${category}
tags: ${tags.join(', ')}
---

${content}`;

    // Create blob and upload
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const file = new File([blob], `${title.toLowerCase().replace(/\s+/g, '-')}.md`, { type: 'text/markdown' });

    const { uploadUrl, fileUrl, s3Key } = await this.generateUploadUrl(file.name, file.type, 'blog');
    await this.uploadFile(file, uploadUrl);

    return { fileUrl, s3Key };
  }

  getContentType(file: File): ContentItem['type'] {
    if (file.name.endsWith('.md') || file.name.endsWith('.txt')) return 'blog';
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'document';
  }
}

export const adminService = new AdminService();
