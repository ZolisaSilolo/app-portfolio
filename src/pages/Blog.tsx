import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search, Filter } from 'lucide-react';
import { getBlogPostsByCategory, getFeaturedPosts, searchBlogPosts } from '../data/blogPosts';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Posts', icon: '📚' },
    { id: 'distributed-systems', name: 'Distributed Systems', icon: '🔗' },
    { id: 'ai-ml', name: 'AI/ML', icon: '🤖' },
    { id: 'agi-thoughts', name: 'AGI Musings', icon: '🧠' },
    { id: 'cloud-architecture', name: 'Cloud Architecture', icon: '☁️' },
    { id: 'tech-musings', name: 'Tech Thoughts', icon: '💭' }
  ];

  const filteredPosts = searchTerm 
    ? searchBlogPosts(searchTerm).filter(post => 
        selectedCategory === 'all' || post.category === selectedCategory
      )
    : getBlogPostsByCategory(selectedCategory);

  const featuredPosts = getFeaturedPosts();

  return (
    <div className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Thumbnail Image */}
          <div className="mb-8">
            <img 
              src="/THUMBNAIL_IMAGE.jpg" 
              alt="Blog Thumbnail" 
              className="w-32 h-32 mx-auto rounded-2xl object-cover shadow-lg glow-effect"
            />
          </div>
          
          <div className="inline-block px-6 py-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-800 dark:text-green-300 text-sm font-medium mb-8">
            [NEURAL_NETWORK_ACTIVE] ✓
          </div>
          <h1 className="text-6xl font-bold gradient-text mb-4 tracking-wide">THOUGHT_STREAM</h1>
          <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-8 font-mono">blog.exe</h2>
          <p className="text-xl text-green-300 max-w-3xl mx-auto">
            Exploring the intersection of distributed systems, AI/ML, and the future of intelligent machines. 
            Sometimes profound, sometimes silly, always curious.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="matrix-card p-6 rounded-2xl mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search thoughts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-green-400/30 rounded-lg text-green-300 placeholder-green-400/50 focus:border-green-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-green-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-black/50 border border-green-400/30 rounded-lg px-4 py-3 text-green-300 focus:border-green-400 focus:outline-none"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {selectedCategory === 'all' && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold matrix-text mb-8">🌟 Featured Thoughts</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map(post => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="matrix-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">{categories.find(c => c.id === post.category)?.icon}</span>
                    <span className="text-green-400 text-sm font-mono">[FEATURED]</span>
                  </div>
                  <h4 className="text-xl font-bold text-green-400 mb-3">{post.title}</h4>
                  <p className="text-cyan-300 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-green-300">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime} min</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div>
          <h3 className="text-2xl font-bold matrix-text mb-8">
            📝 All Thoughts {selectedCategory !== 'all' && `• ${categories.find(c => c.id === selectedCategory)?.name}`}
          </h3>
          <div className="space-y-6">
            {filteredPosts.map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="matrix-card p-6 rounded-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer block">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xl">{categories.find(c => c.id === post.category)?.icon}</span>
                      <span className="text-green-400 text-sm">{categories.find(c => c.id === post.category)?.name}</span>
                    </div>
                    <h4 className="text-lg font-bold text-green-400 mb-2">{post.title}</h4>
                    <p className="text-cyan-300 mb-3">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-green-400/10 text-green-400 text-xs rounded-full border border-green-400/30">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-green-300 mt-4 md:mt-0">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime} min</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Coming Soon */}
        <div className="matrix-card p-8 rounded-2xl mt-16 text-center">
          <h3 className="text-2xl font-bold matrix-text mb-4">🚀 More Thoughts Loading...</h3>
          <p className="text-cyan-300 mb-6">
            New posts on quantum computing, edge AI, and the philosophy of consciousness coming soon.
          </p>
          <div className="flex justify-center">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
