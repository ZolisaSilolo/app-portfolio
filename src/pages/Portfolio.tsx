import { Helmet } from 'react-helmet-async';
import { PageScenery } from '../components/PageScenery';
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
    <div className="py-20 relative isolate overflow-hidden min-h-screen">
      <Helmet>
        <title>Architectural Projects &amp; Case Studies | Lundi Zolisa Silolo</title>
        <meta
          name="description"
          content="Featured projects showcasing AWS serverless architectures, real-time SageMaker MLOps, and automated cloud systems."
        />
        <link rel="canonical" href="https://zolisasilolo.co.za/portfolio" />
      </Helmet>

      {/* Themed page-length background photos */}
      <PageScenery top={{ src: '/portfolio-bridge.jpg', tone: 'day', position: 'center 35%' }} bottom={{ src: '/portfolio-lake.jpg', tone: 'day' }} />
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
            <div key={index} className="bento-card p-5 sm:p-8 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                {/* Icon */}
                <div className="icon-box shrink-0">
                  {getProjectIcon(project.title)}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
                      {project.title}
                    </h3>
                    <p className="text-sm text-zinc-700 dark:text-zinc-400 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        className="btn-secondary text-xs sm:text-sm"
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
                        className="btn-primary text-xs sm:text-sm"
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
        <div className="mt-16 bento-card p-8 sm:p-12 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">
            Explore more on GitHub
          </h3>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mb-6 max-w-lg mx-auto">
            Check out my other projects, contributions, and open-source work.
          </p>
          <a
            href="https://github.com/ZolisaSilolo"
            className="btn-primary inline-flex text-xs sm:text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4" />
            <span>Visit GitHub Profile</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
