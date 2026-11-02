import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HomeScenery } from '../components/HomeScenery';
import { 
  ArrowRight, 
  Github, 
  Linkedin, 
  Mail, 
  Brain, 
  Cloud, 
  Code, 
  Cpu, 
  ArrowUpRight, 
  CheckCircle2, 
  Shield,
  Zap
} from 'lucide-react';

const Home = () => {
  const skills = [
    {
      icon: Brain,
      title: 'AI Systems & MLOps',
      description: 'End-to-end Machine Learning pipelines with Amazon SageMaker, Bedrock LLMs, and real-time inference.',
      youtubeUrl: 'https://www.youtube.com/watch?v=ZGElhJmN_8o',
      tag: 'SageMaker / Bedrock',
      image: '/comp-ai-mlops.jpg',
    },
    {
      icon: Cloud,
      title: 'Cloud Architecture',
      description: 'Well-Architected AWS cloud-native solutions, multi-AZ resilience, and serverless scale.',
      youtubeUrl: 'https://www.youtube.com/watch?v=1aTQI-Kqs2U',
      tag: 'AWS Solutions',
      image: '/comp-cloud-arch.jpg',
    },
    {
      icon: Code,
      title: 'Data Science & Pipelines',
      description: 'Scalable data lakes, stream processing with Kinesis, and automated analytics workflows.',
      youtubeUrl: 'https://www.youtube.com/playlist?list=PLhr1KZpdzukfdjsOHZ-BazZt1iK1J8UUw',
      tag: 'ETL / Analytics',
      image: '/comp-data-pipeline.jpg',
    },
    {
      icon: Cpu,
      title: 'Infrastructure as Code',
      description: 'Declarative CloudFormation and Terraform automation for reproducible enterprise environments.',
      youtubeUrl: 'https://www.youtube.com/watch?v=rmXI_kd_owQ',
      tag: 'IaC / CI-CD',
      image: '/comp-iac.jpg',
    },
  ];

  const featuredProjects = [
    {
      title: 'AI Data Analytics Agent',
      metric: '70% EDA time reduction',
      description: 'Intelligent agent orchestrating Pandas, Amazon Bedrock, and SageMaker to automate exploratory data analysis and insight generation.',
      tags: ['Bedrock', 'SageMaker', 'Python', 'AWS Lambda'],
      url: 'https://github.com/ZolisaSilolo/ai-data-analytics-agent',
      icon: Zap
    },
    {
      title: 'Serverless Fraud Detection System',
      metric: '92% detection accuracy',
      description: 'Real-time anomaly detection pipeline with AWS SageMaker and Amazon Kinesis, cutting false positives by 35% with sub-second latency.',
      tags: ['SageMaker', 'Kinesis', 'Lambda', 'DynamoDB'],
      url: 'https://github.com/ZolisaSilolo/Simple-AWS-Fraud-Detection-Pipeline',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        <title>Lundi Zolisa Silolo — Cloud & AI Solutions Architect</title>
        <meta 
          name="description" 
          content="Cloud & AI Solutions Architect specializing in AWS serverless architectures, MLOps, and scalable system design." 
        />
        <link rel="canonical" href="https://zolisasilolo.co.za" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28">
        {/* Subtle Ambient Background Mesh & Hero Visual (Engineered for Zero Hard Edges) */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10">
          {/* Top Radial Cyan Glow Beam */}
          <div className="ambient-light-beam" />
          
          {/* Background image: Abstract cloud/AI isometric lattice with physical alpha feathering */}
          <div className="absolute inset-0 hero-alpha-mask">
            <img
              src="/hero-cloud-ai.jpg"
              alt=""
              aria-hidden="true"
              className="hero-art-layer"
              loading="eager"
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            {/* Status Beacon Pill without online dot */}
            <div className="inline-flex items-center mb-6">
              <span className="badge px-4 py-1.5 text-xs font-medium tracking-wide">
                Available for Architecture &amp; MLOps Consulting
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1] text-zinc-900 dark:text-zinc-50">
              Cloud &amp; AI Solutions <br className="hidden sm:inline" />
              <span className="text-zinc-500 dark:text-zinc-400">Architect</span>
            </h1>

            {/* Value Proposition Subtext */}
            <p className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-400 mb-8 leading-relaxed max-w-2xl font-normal">
              I architect and build enterprise-grade, serverless systems on AWS. 
              Specializing in production <span className="text-zinc-900 dark:text-zinc-200 font-medium">MLOps</span>, 
              event-driven architectures, and high-throughput data intelligence.
            </p>

            {/* Primary Action Group - responsive layout on mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10">
              <Link to="/portfolio" className="btn-primary text-center">
                View Architectural Projects
                <ArrowRight className="w-4 h-4 ml-1 inline-block" />
              </Link>
              <Link to="/chat" className="btn-secondary text-center">
                Chat with AI Buddy
              </Link>
            </div>

            {/* Social & Contact Links */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2.5">
                <a
                  href="https://github.com/ZolisaSilolo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-box"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="http://linkedin.com/in/lundi-zolisa-s-144922163"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-box"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="mailto:zolisasilolo@gmail.com"
                  className="icon-box"
                  aria-label="Send Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
              <span className="text-xs text-muted font-mono break-all">
                zolisasilolo@gmail.com
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Scenic background zone: Joburg skyline flowing into rainforest */}
      <div className="relative isolate">
        <HomeScenery />

      {/* Featured Projects Highlight */}
      <section className="py-16 border-t border-divider">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2 font-semibold">
                Proven Impact
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Featured Architectures
              </h2>
            </div>
            <Link 
              to="/portfolio" 
              className="inline-flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium transition-colors"
            >
              Explore all 6 case studies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {featuredProjects.map((project, index) => (
              <a
                key={index}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bento-card p-7 group hover:-translate-y-1 transition-all duration-300 block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="icon-box group-hover:scale-105 group-hover:border-cyan-500/40 transition-all">
                      <project.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      <span className="metric-badge mt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {project.metric}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <p className="text-sm text-zinc-700 dark:text-zinc-400 leading-relaxed mb-6">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-divider/60">
                  {project.tags.map(tag => (
                    <span key={tag} className="tech-tag text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Core Technical Competencies Grid with Fading Artwork & Micro-Interactions */}
      <section className="py-20 border-t border-divider">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2 font-semibold">
              Capabilities
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-zinc-900 dark:text-zinc-100">
              Core Technical Competencies
            </h2>
            <p className="text-base text-zinc-700 dark:text-zinc-400">
              Bridging enterprise systems engineering with scalable artificial intelligence.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <a
                key={index}
                href={skill.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden bento-card p-7 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/15 transition-all duration-300 block cursor-pointer"
              >
                {/* Background Artwork Layer with Seamless Radial Mask (Zero Hard Edges in Dark & Light) */}
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-[16px] competency-alpha-mask">
                  <img
                    src={skill.image}
                    alt=""
                    aria-hidden="true"
                    className="competency-art-layer"
                  />
                </div>

                {/* Top Interactive Cyan Accent Border Glow */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-hover:via-cyan-400 transition-all duration-500" />

                {/* Content Layer */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="icon-box group-hover:scale-110 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-all duration-300">
                        <skill.icon className="w-5 h-5" />
                      </div>
                      <span className="tech-tag text-xs group-hover:border-cyan-500/30 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:bg-cyan-500/5 transition-all">
                        {skill.tag}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-800/20 dark:bg-zinc-800/60 light:bg-zinc-200/60 group-hover:bg-cyan-500/10 transition-colors">
                      <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2.5 text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {skill.title}
                  </h3>
                  <p className="text-sm text-zinc-700 dark:text-zinc-400 leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                    {skill.description}
                  </p>

                  <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-1 sm:group-hover:translate-y-0 transition-all duration-300">
                    <span>Watch architectural deep dive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-divider">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bento-card p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="ambient-light-beam !w-[450px] !h-[220px] !top-[-60px] opacity-60" />
            
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-zinc-100 relative z-10">
              Let&apos;s architect something resilient.
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto relative z-10">
              Have a cloud migration, serverless design, or MLOps pipeline you&apos;d like to discuss? Let&apos;s connect.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
              <a href="mailto:zolisasilolo@gmail.com" className="btn-primary">
                Get in touch
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
              <Link to="/about" className="btn-secondary">
                Learn more about my background
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Home;
