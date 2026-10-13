import React from 'react';
import { ExternalLink, Github, Shield, Cloud, Zap, Home, Wrench, ArrowUpRight } from 'lucide-react';
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

  const getProjectIcon = (title: string) => {
    const iconClass = "w-6 h-6";

    if (title.includes("Fraud Detection")) {
      return <Shield className={iconClass} />;
    } else if (title.includes("Awesome Environment")) {
      return <Cloud className={iconClass} />;
    } else if (title.includes("Just Serveless")) {
      return <Zap className={iconClass} />;
    } else if (title.includes("Alexa")) {
      return <Home className={iconClass} />;
    } else if (title.includes("Predictive Maintenance")) {
      return <Wrench className={iconClass} />;
    }
    return <Shield className={iconClass} />;
  };

  return (
    <div className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4" style={{ color: 'rgb(var(--text-primary))', letterSpacing: '-0.03em' }}>
            Projects
          </h1>
          <p className="text-lg text-secondary max-w-2xl">
            Featured projects showcasing cloud architecture, MLOps, and serverless solutions on AWS.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={index} className="card p-8">
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Icon */}
                <div className="lg:col-span-1">
                  <div className="icon-box">
                    {getProjectIcon(project.title)}
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-11 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
                      {project.title}
                    </h3>
                    <p className="text-secondary leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => {
                        const docUrl = awsDocsLinks[tech];
                        const isAWS = !!docUrl;

                        return isAWS ? (
                          <a
                            key={tech}
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tech-tag"
                          >
                            {tech}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        ) : (
                          <span key={tech} className="tech-tag">
                            {tech}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 pt-2">
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        className="btn-secondary text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-4 h-4" />
                        View Code
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        className="btn-primary text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live Demo
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 card p-12 text-center">
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'rgb(var(--text-primary))' }}>
            Explore more on GitHub
          </h3>
          <p className="text-secondary mb-6">
            Check out my other projects, contributions, and open-source work.
          </p>
          <a
            href="https://github.com/ZolisaSilolo"
            className="btn-primary inline-flex"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4" />
            Visit GitHub Profile
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
