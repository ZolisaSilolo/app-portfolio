import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageScenery } from '../components/PageScenery';
import { Calendar, Clock, ArrowRight, Search, ArrowUpRight, BookOpen, Layers } from 'lucide-react';
import { getBlogPostsByCategory, getFeaturedPosts, searchBlogPosts } from '../data/blogPosts';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'cloud-architecture', name: 'Cloud Architecture' },
    { id: 'ai-ml', name: 'AI & MLOps' },
    { id: 'distributed-systems', name: 'Distributed Systems' },
    { id: 'tech-musings', name: 'Engineering Thoughts' }
  ];

  const filteredPosts = searchTerm 
    ? searchBlogPosts(searchTerm).filter(post => 
        selectedCategory === 'all' || post.category === selectedCategory
      )
    : getBlogPostsByCategory(selectedCategory);

  const featuredPosts = getFeaturedPosts();

  const getCategoryLabel = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || catId.replace('-', ' ');
  };

  return (
    <div className="py-20 lg:py-28 relative isolate overflow-hidden min-h-screen">
      <Helmet>
        <title>Engineering Blog &amp; Insights | Lundi Zolisa Silolo</title>
        <meta 
          name="description" 
          content="In-depth technical articles on AWS cloud architecture, distributed systems, MLOps, and modern software design." 
        />
        <link rel="canonical" href="https://zolisasilolo.co.za/blog" />
      </Helmet>

      {/* Themed page-length background photos */}
      <PageScenery top={{ src: '/blog-milkyway.jpg', tone: 'night', position: 'center 40%' }} bottom={{ src: '/blog-ridge.jpg', tone: 'day' }} />

      {/* Top Ambient Cyan Glow */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10">
        <div className="ambient-light-beam" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* Large Thumbnail Image */}
          <div className="mb-8">
            <img
              src="/THUMBNAIL_IMAGE.jpg"
              alt="Blog Thumbnail"
              className="w-full max-w-3xl h-64 mx-auto rounded-2xl object-contain bg-black/20 shadow-2xl shadow-cyan-500/20 ring-1 ring-cyan-500/20"
            />
          </div>

          <div className="inline-block px-6 py-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-800 dark:text-green-300 text-sm font-medium mb-8">
            [NEURAL_NETWORK_ACTIVE] ✓
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-wide mb-4 leading-tight bg-gradient-to-r from-cyan-600 via-sky-500 to-emerald-500 dark:from-cyan-400 dark:via-sky-400 dark:to-emerald-400 bg-clip-text text-transparent">
            THOUGHT_STREAM
          </h1>
          <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-400 leading-relaxed font-normal">
            Reflections and architecture blueprints on AWS cloud engineering, distributed systems, MLOps pipelines, and modern serverless platforms.
          </p>
        </div>

        {/* Glassmorphic Search & Filter Bar */}
        <div className="bento-card p-4 sm:p-5 mb-12 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search articles by title, tag, or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900/60 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts (Only visible when "All" is active and not searching) */}
        {selectedCategory === 'all' && !searchTerm && featuredPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6 text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold">
              <BookOpen className="w-4 h-4" />
              <span>Featured Analyses</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map(post => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="bento-card p-7 group hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 block"
                >
                  {/* Top hairline accent border */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-hover:via-cyan-400 transition-all duration-500" />

                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="metric-badge">
                      {getCategoryLabel(post.category)}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-sm text-zinc-700 dark:text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted pt-4 border-t border-divider/60 font-mono">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime} min read</span>
                      </div>
                    </div>
                    <span className="text-cyan-600 dark:text-cyan-400 font-semibold group-hover:underline">
                      Read article &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Posts Stream */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold">
              <Layers className="w-4 h-4" />
              <span>
                {selectedCategory === 'all' 
                  ? 'All Publications' 
                  : `Filtered: ${getCategoryLabel(selectedCategory)}`}
              </span>
            </div>
            <span className="text-xs text-muted font-mono">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bento-card p-12 text-center text-secondary">
              <p className="text-base font-medium mb-1">No articles found matching your query.</p>
              <p className="text-xs text-muted">Try clearing the search filter or choosing another category.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="bento-card p-6 sm:p-7 group hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 block"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="tech-tag text-[11px]">
                          {getCategoryLabel(post.category)}
                        </span>
                        {post.featured && (
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20">
                            Featured
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg sm:text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-sm text-zinc-700 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 text-xs text-muted font-mono pt-3 md:pt-0 border-t md:border-t-0 border-divider/60 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime} min read</span>
                      </div>
                      <div className="hidden md:flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform mt-2">
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Coming Soon Teaser */}
        <div className="bento-card p-8 sm:p-10 rounded-2xl mt-16 text-center relative overflow-hidden">
          <div className="ambient-light-beam !w-[450px] !h-[200px] !top-[-60px] opacity-50" />
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-zinc-100 relative z-10">
            More Deep Dives in the Pipeline
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto relative z-10">
            Upcoming case studies on autonomous AWS agent orchestration, production SageMaker inference cost reduction, and resilient multi-AZ VPC topologies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;
