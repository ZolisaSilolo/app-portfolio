import React from 'react';
import { FileText, Code, BookOpen } from 'lucide-react';

const Admin = () => {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold matrix-text">Blog Manager</h1>
          <p className="text-cyan-300 mt-2">Add and manage blog posts</p>
        </div>

        {/* Instructions */}
        <div className="matrix-card p-8 rounded-2xl mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="w-8 h-8 text-green-400" />
            <h2 className="text-2xl font-bold text-green-400">How to Add Blog Posts</h2>
          </div>
          
          <div className="space-y-6 text-cyan-300">
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Step 1: Edit the Blog Data File</h3>
              <p className="mb-2">Open <code className="bg-black/50 px-2 py-1 rounded text-green-400">src/data/blogPosts.ts</code></p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Step 2: Add Your Post</h3>
              <p className="mb-3">Add a new object to the <code className="bg-black/50 px-2 py-1 rounded text-green-400">blogPosts</code> array:</p>
              <div className="bg-black/50 p-4 rounded-lg border border-green-400/30 overflow-x-auto">
                <pre className="text-sm text-green-300">
{`{
  id: '2',
  title: 'Your Blog Post Title',
  excerpt: 'A brief summary of your post',
  content: \`
# Your Blog Post Title

Your markdown content here...

## Section 1
Content...

## Section 2
More content...
  \`,
  date: '2025-10-29',
  readTime: 5,
  category: 'tech-musings',
  tags: ['tag1', 'tag2'],
  featured: false,
  author: 'Zolisa Silolo',
  slug: 'your-post-slug'
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Step 3: Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/30 p-2 rounded">
                  <code className="text-green-400">distributed-systems</code>
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <code className="text-green-400">ai-ml</code>
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <code className="text-green-400">agi-thoughts</code>
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <code className="text-green-400">cloud-architecture</code>
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <code className="text-green-400">tech-musings</code>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Step 4: Deploy</h3>
              <div className="bg-black/50 p-4 rounded-lg border border-green-400/30">
                <code className="text-green-300">
                  git add .<br/>
                  git commit -m "Add new blog post"<br/>
                  git push origin new-react-client
                </code>
              </div>
              <p className="mt-2 text-sm">Amplify will automatically build and deploy your changes.</p>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="matrix-card p-8 rounded-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <Code className="w-8 h-8 text-green-400" />
            <h2 className="text-2xl font-bold text-green-400">Markdown Quick Reference</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 text-cyan-300">
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="font-semibold text-green-400 mb-2">Headers</h4>
              <code className="text-sm">
                # H1<br/>
                ## H2<br/>
                ### H3
              </code>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="font-semibold text-green-400 mb-2">Emphasis</h4>
              <code className="text-sm">
                **bold**<br/>
                *italic*<br/>
                `code`
              </code>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="font-semibold text-green-400 mb-2">Lists</h4>
              <code className="text-sm">
                - Item 1<br/>
                - Item 2<br/>
                1. Numbered
              </code>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="font-semibold text-green-400 mb-2">Links</h4>
              <code className="text-sm">
                [text](url)<br/>
                ![alt](image.jpg)
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
