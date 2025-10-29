import React, { useState, useEffect } from 'react';
import { Lock, BookOpen, Code } from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-20 min-h-screen flex items-center justify-center">
        <div className="matrix-card p-8 rounded-2xl max-w-md w-full mx-6">
          <Lock className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold matrix-text text-center mb-6">Admin Access</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-black/50 border border-green-400/30 rounded-lg text-green-300 placeholder-green-400/50 focus:border-green-400 focus:outline-none"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold matrix-text">Blog Manager</h1>
          <button
            onClick={() => { setIsAuthenticated(false); sessionStorage.removeItem('admin_auth'); }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Logout
          </button>
        </div>

        <div className="matrix-card p-8 rounded-2xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Add Posts
            </h2>
            <ol className="space-y-3 text-cyan-300">
              <li>1. Edit <code className="bg-black/50 px-2 py-1 rounded text-green-400">src/data/blogPosts.ts</code></li>
              <li>2. Add your post to the array</li>
              <li>3. Commit and push to GitHub</li>
              <li>4. Amplify auto-deploys</li>
            </ol>
          </div>

          <div className="border-t border-green-400/20 pt-6">
            <h3 className="text-xl font-bold text-green-400 mb-3 flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Template
            </h3>
            <div className="bg-black/50 p-4 rounded-lg border border-green-400/30 overflow-x-auto">
              <pre className="text-sm text-green-300">{`{
  id: '2',
  title: 'Your Title',
  excerpt: 'Brief summary',
  content: \`# Your Title\\n\\nContent here...\`,
  date: '2025-10-29',
  readTime: 5,
  category: 'tech-musings',
  tags: ['tag1'],
  author: 'Zolisa Silolo',
  slug: 'your-slug'
}`}</pre>
            </div>
          </div>

          <div className="border-t border-green-400/20 pt-6">
            <h3 className="text-lg font-bold text-green-400 mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {['distributed-systems', 'ai-ml', 'agi-thoughts', 'cloud-architecture', 'tech-musings'].map(cat => (
                <code key={cat} className="bg-black/30 px-3 py-1 rounded text-green-400 text-sm">{cat}</code>
              ))}
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-4">
            <p className="text-yellow-300 text-sm">
              💡 Change password: Edit line 16 in <code className="bg-black/50 px-2 py-1 rounded">src/pages/Admin.tsx</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
