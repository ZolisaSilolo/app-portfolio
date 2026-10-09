import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Github, Linkedin, Mail, Brain, Cloud, Code, Cpu, ArrowUpRight } from 'lucide-react';

const Home = () => {
  const skills = [
    {
      icon: Brain,
      title: 'AI Systems',
      description: 'Machine Learning Operations and SageMaker expertise for production-grade AI workloads.',
      youtubeUrl: 'https://www.youtube.com/watch?v=ZGElhJmN_8o',
    },
    {
      icon: Cloud,
      title: 'Cloud Architecture',
      description: 'AWS cloud-native solutions and serverless architecture at scale.',
      youtubeUrl: 'https://www.youtube.com/watch?v=1aTQI-Kqs2U',
    },
    {
      icon: Code,
      title: 'Data Science',
      description: 'Cloud-native data science solutions and analytics pipelines.',
      youtubeUrl: 'https://www.youtube.com/playlist?list=PLhr1KZpdzukfdjsOHZ-BazZt1iK1J8UUw',
    },
    {
      icon: Cpu,
      title: 'Infrastructure as Code',
      description: 'Infrastructure-as-Code and automation for repeatable deployments.',
      youtubeUrl: 'https://www.youtube.com/watch?v=rmXI_kd_owQ',
    },
  ];

  const stats = [
    { label: 'AWS Certifications', value: '3x' },
    { label: 'Specialty', value: 'MLOps' },
    { label: 'Focus', value: 'Serverless' },
    { label: 'Approach', value: 'Cloud-Native' },
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Lundi Zolisa Silolo — Cloud & AI Solutions Architect</title>
        <meta name="description" content="Cloud & AI Solutions Architect specializing in AWS serverless architectures and scalable system design." />
        <link rel="canonical" href="https://zolisasilolo.co.za" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="badge">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                Available for new projects
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6" style={{ color: 'rgb(var(--text-primary))', letterSpacing: '-0.03em' }}>
              Cloud & AI Solutions Architect
            </h1>

            <p className="text-xl text-secondary mb-8 leading-relaxed">
              I design and build scalable, serverless systems on AWS.
              Specializing in MLOps, cloud-native architectures, and data-driven applications.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-12">
              <Link to="/portfolio" className="btn-primary">
                View Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/chat" className="btn-secondary">
                Chat with AI Assistant
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/ZolisaSilolo"
                target="_blank"
                rel="noopener noreferrer"
                className="icon-box"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="http://linkedin.com/in/lundi-zolisa-s-144922163"
                target="_blank"
                rel="noopener noreferrer"
                className="icon-box"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:zolisasilolo@gmail.com"
                className="icon-box"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {stats.map((stat, index) => (
              <div key={index} className="card p-6">
                <div className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--text-primary))' }}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 border-t border-divider">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3" style={{ color: 'rgb(var(--text-primary))', letterSpacing: '-0.02em' }}>
              Core Expertise
            </h2>
            <p className="text-lg text-secondary">
              Specializing in AWS cloud-native solutions and serverless architecture
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <a
                key={index}
                href={skill.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-interactive p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="icon-box">
                    <skill.icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
                  {skill.title}
                </h3>
                <p className="text-sm text-secondary leading-relaxed">
                  {skill.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-divider">
        <div className="max-w-6xl mx-auto px-6">
          <div className="card p-12 text-center" style={{ background: 'linear-gradient(135deg, rgba(var(--accent), 0.05) 0%, transparent 100%)' }}>
            <h2 className="text-3xl font-bold tracking-tight mb-3" style={{ color: 'rgb(var(--text-primary))', letterSpacing: '-0.02em' }}>
              Let's work together
            </h2>
            <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
              Have a cloud architecture or AI project in mind? Let's discuss how we can build something great.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:zolisasilolo@gmail.com" className="btn-primary">
                Get in touch
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link to="/about" className="btn-secondary">
                Learn more about me
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
