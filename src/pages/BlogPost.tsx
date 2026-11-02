import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageScenery } from '../components/PageScenery';
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { getBlogPost } from '../data/blogPosts';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : null;
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (post && post.content.endsWith('.html')) {
      fetch(post.content)
        .then(res => res.text())
        .then(html => {
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
      setHtmlContent(post.content);
      setLoading(false);
    }
  }, [post]);

  if (!post) {
    return (
      <div className="py-24 text-center">
        <Helmet>
          <title>Article Not Found | Lundi Zolisa Silolo</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">404: Article Not Found</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">The publication you are looking for does not exist or has been moved.</p>
          <Link to="/blog" className="btn-primary text-sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Return to Engineering Log</span>
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
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="py-20 lg:py-24 relative isolate overflow-hidden min-h-screen scenery-reading">
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

      {/* Themed page-length background photos */}
      <PageScenery top={{ src: '/blog-milkyway.jpg', tone: 'night', position: 'center 40%' }} bottom={{ src: '/blog-ridge.jpg', tone: 'day' }} />

      {/* Top Ambient Cyan Glow */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10">
        <div className="ambient-light-beam" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Back Link */}
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 mb-8 transition-colors font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to all publications</span>
        </Link>

        {/* Article Glass Container */}
        <article className="bento-card p-6 sm:p-10 rounded-2xl shadow-xl">
          <header className="mb-10 pb-8 border-b border-divider/60">
            <div className="flex items-center gap-2 mb-4">
              <span className="metric-badge">
                {post.category.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-400 mb-6 leading-relaxed font-normal">
              {post.excerpt}
            </p>
            
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted font-mono">
              <div className="flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{post.readTime} min read</span>
                </div>
                <div>
                  <span>Author: {post.author}</span>
                </div>
              </div>
              
              <button 
                onClick={handleShare}
                className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
                title="Share article link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-6">
              {post.tags.map(tag => (
                <span 
                  key={tag} 
                  className="tech-tag text-xs"
                >
                  <Tag className="w-3 h-3 mr-1 opacity-70" />
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Article Content */}
          <div className="blog-content">
            {loading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin mx-auto" />
                <p className="text-xs text-muted mt-4 font-mono">Loading content...</p>
              </div>
            ) : (
              <div 
                className="leading-relaxed text-zinc-700 dark:text-zinc-300"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            )}
          </div>

          {/* Article Footer */}
          <footer className="mt-14 pt-8 border-t border-divider/60">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted font-mono">
                Published by Zolisa Silolo • Cloud &amp; AI Architect
              </p>
              <button 
                onClick={handleShare}
                className="btn-primary text-xs"
              >
                <Share2 className="w-3.5 h-3.5 mr-1.5" />
                Share Publication
              </button>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
