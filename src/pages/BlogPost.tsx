import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { getBlogPost } from '../data/blogPosts';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : null;
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (post && post.content.endsWith('.html')) {
      // Fetch HTML content
      fetch(post.content)
        .then(res => res.text())
        .then(html => {
          // Extract just the article content (remove <article> wrapper if present)
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const article = doc.querySelector('article');
          setHtmlContent(article ? article.innerHTML : html);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading blog post:', err);
          setHtmlContent('<p>Error loading blog post content.</p>');
          setLoading(false);
        });
    } else if (post) {
      // Use inline content (legacy support)
      setHtmlContent(post.content);
      setLoading(false);
    }
  }, [post]);

  if (!post) {
    return (
      <div className="py-20 text-center">
        <Helmet>
          <title>Post Not Found | Lundi Zolisa Silolo</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-4xl font-bold matrix-text mb-4">404: Post Not Found</h1>
          <p className="text-cyan-300 mb-8">The thought you're looking for doesn't exist in this reality.</p>
          <Link to="/blog" className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Thought Stream</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <div className="py-20">
      <Helmet>
        <title>{post.title} | Lundi Zolisa Silolo</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <link rel="canonical" href={`https://zolisasilolo.co.za/blog/${slug}`} />
      </Helmet>
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <Link 
          to="/blog" 
          className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Thought Stream</span>
        </Link>

        {/* Article Header */}
        <article className="matrix-card p-8 rounded-2xl">
          <header className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-green-400/10 text-green-400 text-sm rounded-full border border-green-400/30">
                {post.category.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold matrix-text mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-cyan-300 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-green-300">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} min read</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>By {post.author}</span>
                </div>
              </div>
              
              <button 
                onClick={handleShare}
                className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map(tag => (
                <span 
                  key={tag} 
                  className="flex items-center space-x-1 px-2 py-1 bg-green-400/10 text-green-400 text-xs rounded-full border border-green-400/30"
                >
                  <Tag className="w-3 h-3" />
                  <span>#{tag}</span>
                </span>
              ))}
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-invert prose-green max-w-none blog-content">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                <p className="text-cyan-300 mt-4">Loading content...</p>
              </div>
            ) : (
              <div 
                className="text-cyan-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            )}
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-green-400/20">
            <div className="flex items-center justify-between">
              <div className="text-sm text-green-300">
                <p>Thanks for reading! Share your thoughts and let's discuss.</p>
              </div>
              <button 
                onClick={handleShare}
                className="px-4 py-2 bg-green-400/10 text-green-400 rounded-lg border border-green-400/30 hover:bg-green-400/20 transition-colors"
              >
                Share This Post
              </button>
            </div>
          </footer>
        </article>

        {/* Related Posts Section - You can implement this later */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold matrix-text mb-8">More Thoughts</h3>
          <div className="matrix-card p-6 rounded-xl text-center">
            <p className="text-cyan-300">More related posts coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
