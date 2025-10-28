import React, { useState, useEffect } from 'react';
import { Upload, FileText, Image, Video, Music, Lock, Check, X, Eye } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'blog' | 'image' | 'video' | 'audio' | 'document';
  url: string;
  uploadDate: string;
  status: 'draft' | 'published';
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Simple admin authentication (in production, use proper auth)
  const ADMIN_PASSWORD = 'ZolisaAdmin2025!'; // Change this to your secure password

  const handleAuth = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_session', 'true');
    } else {
      alert('Invalid password');
    }
  };

  useEffect(() => {
    // Check if already authenticated
    if (localStorage.getItem('admin_session') === 'true') {
      setIsAuthenticated(true);
    }
    // Load existing content from S3 (implement this with your backend)
    loadContent();
  }, []);

  const loadContent = async () => {
    // This would call your Lambda function to list S3 objects
    // For now, using mock data
    const mockContent: ContentItem[] = [
      {
        id: '1',
        title: 'Sample Blog Post',
        type: 'blog',
        url: 's3://your-bucket/blogs/sample-post.md',
        uploadDate: '2025-10-28',
        status: 'published'
      }
    ];
    setContent(mockContent);
  };

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    
    for (const file of Array.from(files)) {
      try {
        // Generate presigned URL from your Lambda function
        const response = await fetch('/api/admin/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            contentType: getContentType(file)
          })
        });

        const { uploadUrl, fileUrl } = await response.json();

        // Upload to S3 using presigned URL
        await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type }
        });

        // Add to content list
        const newItem: ContentItem = {
          id: Date.now().toString(),
          title: file.name,
          type: getContentType(file),
          url: fileUrl,
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'draft'
        };

        setContent(prev => [...prev, newItem]);
      } catch (error) {
        console.error('Upload failed:', error);
        alert(`Failed to upload ${file.name}`);
      }
    }
    
    setUploading(false);
  };

  const getContentType = (file: File): ContentItem['type'] => {
    if (file.name.endsWith('.md') || file.name.endsWith('.txt')) return 'blog';
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const getIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'blog': return <FileText className="w-5 h-5" />;
      case 'image': return <Image className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const toggleStatus = async (id: string) => {
    setContent(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'draft' ? 'published' : 'draft' }
        : item
    ));
    // Update status in S3/database via API call
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-20 min-h-screen flex items-center justify-center">
        <div className="matrix-card p-8 rounded-2xl max-w-md w-full mx-6">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold matrix-text">Admin Access</h1>
            <p className="text-cyan-300 mt-2">Enter password to manage content</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              placeholder="Admin password"
              className="w-full px-4 py-3 bg-black/50 border border-green-400/30 rounded-lg text-green-300 placeholder-green-400/50 focus:border-green-400 focus:outline-none"
            />
            <button
              onClick={handleAuth}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Access Admin Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold matrix-text">Content Manager</h1>
            <p className="text-cyan-300 mt-2">Upload and manage your blog posts and media</p>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              localStorage.removeItem('admin_session');
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Upload Area */}
        <div className="matrix-card p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-6">Upload Content</h2>
          
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-green-400 bg-green-400/10' 
                : 'border-green-400/30 hover:border-green-400/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-cyan-300 mb-4">
              Supports: .md, .txt (blogs), images, videos, audio files
            </p>
            
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
              accept=".md,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mov,.mp3,.wav,.pdf"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
            >
              Choose Files
            </label>
          </div>

          {uploading && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center space-x-2 text-green-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                <span>Uploading...</span>
              </div>
            </div>
          )}
        </div>

        {/* Content List */}
        <div className="matrix-card p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-green-400 mb-6">Content Library</h2>
          
          <div className="space-y-4">
            {content.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-green-400/20">
                <div className="flex items-center space-x-4">
                  <div className="text-green-400">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-400">{item.title}</h3>
                    <p className="text-sm text-cyan-300">
                      {item.type.toUpperCase()} • {item.uploadDate}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'published' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-yellow-600 text-white'
                  }`}>
                    {item.status}
                  </span>
                  
                  <button
                    onClick={() => toggleStatus(item.id)}
                    className="p-2 hover:bg-green-400/20 rounded-lg transition-colors"
                  >
                    {item.status === 'published' ? (
                      <X className="w-4 h-4 text-red-400" />
                    ) : (
                      <Check className="w-4 h-4 text-green-400" />
                    )}
                  </button>
                  
                  <button className="p-2 hover:bg-green-400/20 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
