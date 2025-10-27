import React from 'react';
import { ExternalLink, Github, Shield, Cloud, Zap, Home, Wrench } from 'lucide-react';
import { projects } from '../data/projects';

const Portfolio = () => {
  const awsDocsLinks: { [key: string]: string } = {
    "AWS Lambda": "https://aws.amazon.com/lambda/",
    "S3": "https://aws.amazon.com/s3/",
    "API Gateway": "https://aws.amazon.com/api-gateway/",
    "DynamoDB": "https://aws.amazon.com/dynamodb/",
    "Amazon SageMaker": "https://aws.amazon.com/sagemaker/",
    "SNS Topic": "https://aws.amazon.com/sns/",
    "Amazon Kinesis": "https://aws.amazon.com/kinesis/",
    "VPC": "https://aws.amazon.com/vpc/",
    "RDS": "https://aws.amazon.com/rds/",
    "CloudFront": "https://aws.amazon.com/cloudfront/",
    "CloudFormation": "https://aws.amazon.com/cloudformation/",
    "Route 53": "https://aws.amazon.com/route53/",
    "WAF": "https://aws.amazon.com/waf/",
    "AWS Backup": "https://aws.amazon.com/backup/",
    "OpenSearchServerless": "https://aws.amazon.com/opensearch-service/serverless/",
    "AWS IoT": "https://aws.amazon.com/iot/",
    "Alexa Skills Kit": "https://developer.amazon.com/alexa/alexa-skills-kit"
  };

  const getProjectIcon = (title: string, index: number) => {
    const iconProps = "w-16 h-16 text-green-400";
    
    if (title.includes("Fraud Detection")) {
      return <Shield className={`${iconProps} project-icon-3d fraud-detection`} />;
    } else if (title.includes("Awesome Environment")) {
      return <Cloud className={`${iconProps} project-icon-3d cloud-infra`} />;
    } else if (title.includes("Just Serverless")) {
      return <Zap className={`${iconProps} project-icon-3d ai-efficiency`} />;
    } else if (title.includes("Alexa")) {
      return <Home className={`${iconProps} project-icon-3d smart-home`} />;
    } else if (title.includes("Predictive Maintenance")) {
      return <Wrench className={`${iconProps} project-icon-3d predictive-maintenance`} />;
    }
    return <Shield className={`${iconProps} project-icon-3d`} />;
  };

  return (
    <div className="min-h-screen matrix-grid py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold matrix-text mb-6 font-mono">
            &gt; MY_PROFESSIONAL_PORTFOLIO.exe
          </h1>
          <p className="text-xl text-green-300 max-w-3xl mx-auto font-mono">
            [INITIALIZING...] Welcome to my portfolio! Here you'll find my featured projects and technical expertise.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold matrix-text mb-8 font-mono">
            &gt; FEATURED_PROJECTS.load()
          </h2>
        </div>
        
        <div className="space-y-12">
          {projects.map((project, index) => (
            <div key={index} className="matrix-card rounded-2xl overflow-hidden retro-border">
              <div className="grid lg:grid-cols-3 gap-8 p-8">
                {/* Project 3D Icon */}
                <div className="lg:col-span-1 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 matrix-card rounded-3xl flex items-center justify-center floating-animation glow-effect" 
                         style={{ animationDelay: `${index * 0.2}s` }}>
                      {getProjectIcon(project.title, index)}
                    </div>
                    
                    {/* Matrix-style decorative elements */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 border-2 border-green-400 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 border-2 border-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    
                    {/* Scanning line effect */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-green-400 mb-4 font-mono">
                      &gt; {project.title.toUpperCase().replace(/ /g, '_')}
                    </h3>
                    <p className="text-green-300 leading-relaxed font-mono text-sm">
                      {project.description}
                    </p>
                  </div>
                  
                  {/* Technologies */}
                  <div>
                    <h4 className="font-semibold text-green-400 mb-3 font-mono">
                      [TECH_STACK]:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => {
                        const docUrl = awsDocsLinks[tech] || "#";
                        const isAWS = awsDocsLinks[tech];
                        
                        return (
                          <a
                            key={tech}
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tech-tag px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                          >
                            {tech}
                            {isAWS && <ExternalLink className="w-3 h-3 ml-1 inline" />}
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Repository and Live Links */}
                  <div className="flex items-center space-x-4">
                    {project.repo_url && (
                      <a 
                        href={project.repo_url} 
                        className="cyber-button px-6 py-3 rounded-xl font-mono font-medium transition-all duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-5 h-5 inline mr-2" />
                        ACCESS_REPOSITORY
                      </a>
                    )}
                    {project.live_url && (
                      <a 
                        href={project.live_url} 
                        className="cyber-button-secondary px-6 py-3 rounded-xl font-mono font-medium transition-all duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-5 h-5 inline mr-2" />
                        VIEW_LIVE_SITE
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="matrix-card p-12 rounded-3xl retro-border">
            <h3 className="text-3xl font-bold matrix-text mb-4 font-mono">
              &gt; EXPLORE_MORE.init()
            </h3>
            <p className="text-xl text-green-300 mb-8 font-mono">
              [SCANNING...] View all my projects and contributions on GitHub
            </p>
            <a 
              href="https://github.com/ZolisaSilolo"
              className="inline-flex items-center space-x-2 cyber-button px-8 py-4 rounded-xl font-mono font-medium transition-all duration-300 glow-effect"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-6 h-6" />
              <span>VISIT_GITHUB_MATRIX</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
