import React, { useState, useEffect } from 'react';
import { Upload, FileText, Check, X, Eye, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { blogService, BlogPost } from '../services/blogService';
import Login from '../components/Login';

const Admin = () => {
  const { isAuthenticated, isAdmin, logout, loading } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadPosts();
    }
  }, [isAuthenticated, isAdmin]);

  if (loading) {
    return (
      <div className="py-20 min-h-screen flex items-center justify-center">
        <div className="matrix-card p-8 rounded-2xl max-w-md w-full mx-6 text-center">
          <div className="w-8 h-8 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-bold matrix-text">Loading...</h1>
        </div>
      </div>
    );
  }

  const loadPosts = async () => {
    try {
      const data = await blogService.listPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    setError('');
    
    for (const file of Array.from(files)) {
      try {
        await blogService.uploadFile(file);
      } catch (err) {
        setError(`Failed to upload ${file.name}`);
        console.error(err);
      }
    }
    
    setUploading(false);
    await loadPosts();
  };

  const handlePublish = async (s3Key: string) => {
    try {
      await blogService.publishPost(s3Key);
      await loadPosts();
    } catch (err) {
      setError('Failed to publish post');
      console.error(err);
    }
  };

  const handleDelete = async (s3Key: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await blogService.deletePost(s3Key);
      await loadPosts();
    } catch (err) {
      setError('Failed to delete post');
      console.error(err);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  if (!isAuthenticated) {
    return (
      <Login 
        title="Admin Access"
        description="Enter admin credentials to manage content"
      />
    );
  }

  if (!isAdmin) {
    return (
      <div className="py-20 min-h-screen flex items-center justify-center">
        <div className="matrix-card p-8 rounded-2xl max-w-md w-full mx-6 text-center">
          <h1 className="text-2xl font-bold matrix-text mb-4">Access Denied</h1>
          <p className="text-cyan-300 mb-6">You don't have admin privileges.</p>
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold matrix-text">Blog Manager</h1>
            <p className="text-cyan-300 mt-2">Upload and publish blog posts</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {error && (
          <div className="matrix-card p-4 rounded-lg mb-6 bg-red-900/20 border border-red-400/30">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Upload Area */}
        <div className="matrix-card p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-6">Upload Blog Post</h2>
          
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
              Drop markdown files here
            </h3>
            <p className="text-cyan-300 mb-4">
              Supports: .md, .txt files
            </p>
            
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
              accept=".md,.txt"
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

        {/* Posts List */}
        <div className="matrix-card p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-green-400 mb-6">Blog Posts</h2>
          
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-green-400/20">
                <div className="flex items-center space-x-4">
                  <FileText className="w-5 h-5 text-green-400" />
                  <div>
                    <h3 className="font-semibold text-green-400">{post.title}</h3>
                    <p className="text-sm text-cyan-300">
                      {new Date(post.uploadDate).toLocaleDateString()} • {(post.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    post.status === 'published' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-yellow-600 text-white'
                  }`}>
                    {post.status}
                  </span>
                  
                  {post.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(post.s3Key)}
                      className="p-2 hover:bg-green-400/20 rounded-lg transition-colors"
                      title="Publish"
                    >
                      <Check className="w-4 h-4 text-green-400" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(post.s3Key)}
                    className="p-2 hover:bg-red-400/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
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
