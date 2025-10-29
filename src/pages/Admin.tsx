import React, { useState, useEffect } from 'react';
import { Upload, FileText, Check, Trash2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  status: 'draft' | 'published';
  uploadDate: string;
  size: number;
}

const Admin = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    // Mock upload for now
    setTimeout(() => {
      setUploading(false);
    }, 1000);
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

  return (
    <div className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold matrix-text">Blog Manager</h1>
          <p className="text-cyan-300 mt-2">Upload and publish blog posts</p>
        </div>

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
          
          <div className="text-center text-cyan-300 py-8">
            <p>No posts yet. Upload your first blog post above.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
