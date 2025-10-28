import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, Mail, Terminal, Zap, Target, Brain, Cloud, Code, Cpu } from 'lucide-react';

const Home = () => {
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);

  const skills = [
    {
      icon: Brain,
      title: 'AI_SYSTEMS',
      description: 'Machine Learning Operations and SageMaker expertise',
      animationClass: 'fraud-detection',
      youtubeUrl: 'https://www.youtube.com/watch?v=Le-A72NjaWs'
    },
    {
      icon: Cloud,
      title: 'CLOUD_ARCH',
      description: 'AWS cloud-native solutions and serverless architecture',
      animationClass: 'cloud-infra',
      youtubeUrl: 'https://www.youtube.com/watch?v=1aTQI-Kqs2U'
    },
    {
      icon: Code,
      title: 'DATA_SCI',
      description: 'Cloud-native data science solutions and analytics',
      animationClass: 'ai-efficiency',
      youtubeUrl: 'https://www.youtube.com/playlist?list=PLhr1KZpdzukfdjsOHZ-BazZt1iK1J8UUw'
    },
    {
      icon: Cpu,
      title: 'INFRA_CODE',
      description: 'Infrastructure-as-Code and automation',
      animationClass: 'predictive-maintenance',
      youtubeUrl: 'https://www.youtube.com/watch?v=rmXI_kd_owQ'
    }
  ];

  return (
    <div className="min-h-screen matrix-grid">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-cyan-900/5 to-green-900/10"></div>
        
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-400 font-mono">
                  <Terminal className="w-5 h-5 project-icon-3d" />
                  <span className="text-sm font-medium">[SYSTEM_INITIALIZED]</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight font-mono">
                  <span className="matrix-text">&gt; LUNDI_ZOLISA</span>
                  <br />
                  <span className="text-green-400">&gt; SILOLO.exe</span>
                </h1>
                
                <div className="flex items-center space-x-3 mt-4 p-3 matrix-card rounded-lg border border-green-400/30">
                  <div className="text-2xl animate-pulse">🧠</div>
                  <div>
                    <Link to="/blog" className="text-cyan-400 hover:text-green-400 transition-colors font-mono text-sm">
                      [THOUGHT_STREAM] → Exploring AI, distributed systems & the future of intelligence
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/portfolio"
                  className="group cyber-button px-8 py-4 rounded-xl font-mono font-medium transition-all duration-300 glow-effect"
                >
                  <span>ACCESS_PROJECTS</span>
                  <ArrowRight className="w-5 h-5 project-icon-3d inline ml-2 group-hover:translate-x-1" />
                </Link>
                
                <Link
                  to="/chat"
                  className="flex items-center space-x-2 matrix-card px-8 py-4 rounded-xl font-mono font-medium transition-all duration-300"
                >
                  <Zap className="w-5 h-5 project-icon-3d text-green-400" />
                  <span className="text-green-400">AI_ASSISTANT</span>
                </Link>
              </div>

              <div className="flex items-center space-x-6">
                <a
                  href="https://github.com/ZolisaSilolo"
                  className="p-3 matrix-card rounded-xl hover:scale-110 transition-all duration-300 glow-effect"
                >
                  <Github className="w-6 h-6 project-icon-3d text-green-400" />
                </a>
                <a
                  href="http://linkedin.com/in/lundi-zolisa-s-144922163"
                  className="p-3 matrix-card rounded-xl hover:scale-110 transition-all duration-300 glow-effect"
                >
                  <Linkedin className="w-6 h-6 project-icon-3d text-cyan-400" />
                </a>
                <a
                  href="mailto:zolisasilolo@gmail.com"
                  className="p-3 matrix-card rounded-xl hover:scale-110 transition-all duration-300 glow-effect"
                >
                  <Mail className="w-6 h-6 project-icon-3d text-green-400" />
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 matrix-card p-8 rounded-3xl floating-animation retro-border">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold font-mono text-green-400">
                      [STATUS_REPORT]
                    </h3>
                    <Target className="w-5 h-5 project-icon-3d text-green-400" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold matrix-text font-mono hover:animate-spin transform-gpu transition-transform duration-500 cursor-pointer">AWS</div>
                      <div className="text-sm text-green-300 font-mono hover:scale-110 transition-transform duration-300 cursor-pointer">3x_CERT</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold matrix-text font-mono">MLOPS</div>
                      <div className="text-sm text-green-300 font-mono">SAGEMAKER</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold matrix-text font-mono">CLOUD</div>
                      <div className="text-sm text-green-300 font-mono">NATIVE</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold matrix-text font-mono">DATA</div>
                      <div className="text-sm text-green-300 font-mono">SCIENCE</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Matrix-style decorative elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-green-400/10 to-cyan-400/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-br from-cyan-400/10 to-green-400/5 rounded-full blur-3xl"></div>
              
              {/* Scanning lines */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-0.5 h-full bg-gradient-to-t from-transparent via-cyan-400 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-green-900/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold matrix-text mb-4 font-mono">
              &gt; CORE_MODULES.load()
            </h2>
            <p className="text-xl text-green-300 font-mono">
              [INITIALIZING...] Specializing in AWS cloud-native solutions and serverless architecture
            </p>
          </div>

          <div className="overflow-hidden">
            <div className="flex animate-scroll space-x-6">
              {/* First set of tiles */}
              {skills.map((skill, index) => (
                <div key={index} className="flex-shrink-0 w-80 matrix-card p-6 rounded-2xl text-center relative overflow-hidden">
                  {/* Digital rain background - dark mode only */}
                  <div className="absolute inset-0 opacity-20 dark:block hidden">
                    <div className="matrix-rain-bg"></div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 matrix-card rounded-2xl flex items-center justify-center mx-auto mb-4 floating-animation glow-effect">
                      <skill.icon className="w-8 h-8 text-green-400 project-icon-3d" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 font-mono text-green-400">
                      [{skill.title}]
                    </h3>
                    <p className="text-green-300 text-sm font-mono mb-4">{skill.description}</p>
                    <a
                      href={skill.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full py-2 px-3 bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 hover:border-green-400/50 text-green-400 text-xs rounded-lg transition-all duration-300 font-mono backdrop-blur-sm"
                    >
                      📺
                    </a>
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {skills.map((skill, index) => (
                <div key={`duplicate-${index}`} className="flex-shrink-0 w-80 matrix-card p-6 rounded-2xl text-center relative overflow-hidden">
                  {/* Digital rain background - dark mode only */}
                  <div className="absolute inset-0 opacity-20 dark:block hidden">
                    <div className="matrix-rain-bg"></div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 matrix-card rounded-2xl flex items-center justify-center mx-auto mb-4 floating-animation glow-effect">
                      <skill.icon className="w-8 h-8 text-green-400 project-icon-3d" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 font-mono text-green-400">
                      [{skill.title}]
                    </h3>
                    <p className="text-green-300 text-sm font-mono mb-4">{skill.description}</p>
                    <a
                      href={skill.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full py-2 px-3 bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 hover:border-green-400/50 text-green-400 text-xs rounded-lg transition-all duration-300 font-mono backdrop-blur-sm"
                    >
                      📺
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="matrix-card p-12 rounded-3xl relative overflow-hidden retro-border">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold matrix-text mb-4 font-mono">
                &gt; COLLABORATION.init()
              </h2>
              <p className="text-xl text-green-300 mb-8 font-mono">
                [READY] Let's discuss your cloud architecture and data science needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:zolisasilolo@gmail.com" 
                  className="cyber-button px-8 py-4 rounded-xl font-mono font-medium transition-all duration-300 glow-effect"
                >
                  ESTABLISH_CONNECTION
                </a>
                <Link 
                  to="/chat" 
                  className="matrix-card px-8 py-4 rounded-xl font-mono font-medium transition-all duration-300 text-green-400"
                >
                  ACTIVATE_AI_BUDDY
                </Link>
              </div>
            </div>
            
            {/* Matrix rain effect simulation */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-cyan-400/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-green-400/5 rounded-full blur-2xl"></div>
            
            {/* Scanning lines */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400/50 to-transparent animate-pulse"></div>
              <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
