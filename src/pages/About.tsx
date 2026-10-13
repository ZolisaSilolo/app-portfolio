import React from 'react';
import { Award, MapPin, Mail, Linkedin, Github, ExternalLink, Briefcase } from 'lucide-react';

const About = () => {
  const skillCategories = [
    {
      title: "Cloud Platforms & Architecture",
      skills: [
        "AWS (Expert) — Solutions Architecture & Implementation",
        "Azure (Intermediate) — Multi-cloud strategies",
        "Serverless Architecture — Event-driven solutions",
        "Infrastructure-as-Code — CloudFormation & Terraform"
      ]
    },
    {
      title: "AI/ML & Data Science",
      skills: [
        "Amazon SageMaker — ML model development & deployment",
        "Amazon Bedrock — Generative AI applications",
        "Predictive Analytics — Business intelligence solutions",
        "Databricks — Big data processing & analytics",
        "MLOps — ML lifecycle management"
      ]
    },
    {
      title: "Programming & Automation",
      skills: [
        "Python — Primary development language",
        "SQL — Database querying & optimization",
        "Bash — System automation & scripting",
        "REST APIs — Service integration",
        "CI/CD Pipelines — Automated deployments"
      ]
    },
    {
      title: "Data Engineering",
      skills: [
        "Data Lakes — Scalable data storage solutions",
        "Real-Time Analytics — Stream processing",
        "Big Data Processing — Large-scale data workflows",
        "ETL/ELT Pipelines — Data transformation"
      ]
    },
    {
      title: "Security & Compliance",
      skills: [
        "IAM — Identity & access management",
        "Cloud Security — Multi-layer protection",
        "Encryption — Data protection at rest & in transit",
        "Digital Sovereignty — Compliance frameworks"
      ]
    },
    {
      title: "IoT & Systems",
      skills: [
        "AWS IoT Core — Device connectivity & management",
        "MQTT Protocol — Lightweight messaging",
        "Edge Computing — Distributed processing",
        "Microservices Architecture — Scalable system design"
      ]
    }
  ];

  const certifications = [
    {
      title: "AWS Certified Solutions Architect – Associate",
      image: "/aws-cert.jpg",
      url: "https://www.credly.com/badges/5a590c66-cc83-4c31-8c07-44245f27dd2a/linked_in_profile"
    },
    {
      title: "AWS AI Practitioner",
      image: "/ai-practitioner-cert.jpg",
      url: "https://www.credly.com/badges/3f988f0a-2835-4af4-8a6c-f64d8d2564a3/linked_in_profile"
    },
    {
      title: "AWS Partner: Generative AI Essentials",
      image: "/genai-cert.jpg",
      url: "https://www.credly.com/badges/e5c13153-48e3-452d-92e2-a66b504bc3bd/linked_in_profile"
    },
    {
      title: "AWS Knowledge: Events & Workflow",
      image: "/events-workflow-cert.jpg",
      url: "https://www.credly.com/badges/436dca12-95c3-4086-869d-bcdef68c2447/linked_in_profile"
    },
    {
      title: "AWS Well-Architected Proficient",
      image: "/WELL-ARCHITECTED.jpg",
      url: "https://www.credly.com/badges/83f3ee22-5f6c-4446-914b-0cb5ccb38b61/linked_in_profile"
    },
    {
      title: "Databricks Lakehouse Fundamentals",
      icon: "🧱",
      url: "https://credentials.databricks.com/786390fc-a51c-416c-bd42-38ee5a9dacac"
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="badge">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Available for opportunities
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4" style={{ color: 'rgb(var(--text-primary))', letterSpacing: '-0.03em' }}>
            Lundi Zolisa Silolo
          </h1>
          <p className="text-xl text-secondary mb-8 max-w-3xl leading-relaxed">
            Cloud & AI Solutions Architect with hands-on experience designing secure, scalable architectures
            and driving AI-powered innovation on AWS.
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
            <div className="card p-6">
              <div className="flex items-start gap-4">
                <div className="icon-box flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: 'rgb(var(--text-primary))' }}>
                    Cloud & Serverless
                  </h3>
                  <p className="text-sm text-secondary">
                    AWS, Serverless Architectures, Cloud Security, Infrastructure-as-Code
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-start gap-4">
                <div className="icon-box flex-shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: 'rgb(var(--text-primary))' }}>
                    Data & AI
                  </h3>
                  <p className="text-sm text-secondary">
                    Big Data Solutions, Analytics, SageMaker, Bedrock, MLOps
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-2" style={{ borderColor: 'rgb(var(--border))' }}>
                <img src="/profile.jpg" alt="Lundi Zolisa Silolo" className="w-full h-full object-cover" />
              </div>

              <h2 className="text-xl font-bold text-center mb-1" style={{ color: 'rgb(var(--text-primary))' }}>
                Lundi Zolisa Silolo
              </h2>
              <p className="text-sm text-secondary text-center mb-6">
                AWS Certified Cloud & Data Professional
              </p>

              <div className="space-y-3 mb-6 pb-6 border-b border-divider">
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <MapPin className="w-4 h-4 text-muted flex-shrink-0" />
                  <span>Johannesburg, South Africa</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <Mail className="w-4 h-4 text-muted flex-shrink-0" />
                  <a href="mailto:zolisasilolo@gmail.com" className="hover:text-accent transition-colors">
                    zolisasilolo@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <Award className="w-4 h-4 text-muted flex-shrink-0" />
                  <span>AWS Solutions Architect Associate</span>
                </div>
              </div>

              <div className="flex justify-center gap-2">
                <a href="mailto:zolisasilolo@gmail.com" className="icon-box" aria-label="Email">
                  <Mail className="w-4 h-4" />
                </a>
                <a href="http://linkedin.com/in/lundi-zolisa-s-144922163" target="_blank" rel="noopener noreferrer" className="icon-box" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://github.com/ZolisaSilolo" target="_blank" rel="noopener noreferrer" className="icon-box" aria-label="GitHub">
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Professional Experience */}
            <div className="card p-8">
              <h3 className="text-2xl font-bold mb-6" style={{ color: 'rgb(var(--text-primary))' }}>
                Professional Experience
              </h3>

              <div className="border-l-2 pl-6 pb-2" style={{ borderColor: 'rgb(var(--accent))' }}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
                    AWS Professional Services Intern
                  </h4>
                  <span className="text-sm text-muted">2025</span>
                </div>
                <p className="text-sm text-secondary mb-4">Amazon Web Services • Johannesburg, South Africa</p>
                <ul className="space-y-2 text-sm text-secondary">
                  <li className="flex gap-2">
                    <span className="text-accent mt-1.5">•</span>
                    <span>Designed and deployed MLOps pipelines using Amazon SageMaker and Bedrock for AI/ML workflows</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent mt-1.5">•</span>
                    <span>Automated cloud-native solutions with AWS Lambda, Step Functions, and Infrastructure-as-Code</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent mt-1.5">•</span>
                    <span>Supported workshops for C-level executives on big data, AI/ML strategy, and cloud transformation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent mt-1.5">•</span>
                    <span>Enhanced client satisfaction by optimizing solution delivery pipelines and addressing technical bottlenecks</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Technical Expertise */}
            <div className="card p-8">
              <h3 className="text-2xl font-bold mb-6" style={{ color: 'rgb(var(--text-primary))' }}>
                Technical Expertise
              </h3>
              <div className="grid gap-6">
                {skillCategories.map((category, index) => (
                  <div key={index}>
                    <h4 className="text-base font-semibold mb-3 text-accent">
                      {category.title}
                    </h4>
                    <div className="grid gap-1.5">
                      {category.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className="text-sm text-secondary flex gap-2">
                          <span className="text-muted">•</span>
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="card p-8">
              <h3 className="text-2xl font-bold mb-6" style={{ color: 'rgb(var(--text-primary))' }}>
                Certifications
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {certifications.map((cert, index) => (
                  <a
                    key={index}
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-interactive p-4 text-center group"
                  >
                    {cert.image ? (
                      <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden border" style={{ borderColor: 'rgb(var(--border))' }}>
                        <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="text-4xl mb-3">{cert.icon}</div>
                    )}
                    <h4 className="font-medium text-xs mb-2 leading-tight" style={{ color: 'rgb(var(--text-primary))' }}>
                      {cert.title}
                    </h4>
                    <div className="flex items-center justify-center gap-1 text-xs text-muted group-hover:text-accent transition-colors">
                      <span>View Badge</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Personal Note */}
            <div className="card p-8" style={{ background: 'linear-gradient(135deg, rgba(var(--accent), 0.05) 0%, transparent 100%)' }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'rgb(var(--text-primary))' }}>
                Let's connect
              </h3>
              <p className="text-secondary mb-4">
                I'm always interested in hearing about new projects and opportunities in cloud architecture and AI/ML.
              </p>
              <a href="mailto:zolisasilolo@gmail.com" className="btn-primary inline-flex">
                <Mail className="w-4 h-4" />
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
