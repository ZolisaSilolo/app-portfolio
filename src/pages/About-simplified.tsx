import React from 'react';
import { Award, MapPin, Mail, Linkedin, Github, ExternalLink } from 'lucide-react';

const About = () => {
  const skills = [
    { icon: "☁️", title: "Cloud", items: ["AWS Solutions Architecture", "Serverless & IaC", "Multi-cloud strategies"] },
    { icon: "🤖", title: "AI/ML", items: ["SageMaker & Bedrock", "MLOps pipelines", "Predictive analytics"] },
    { icon: "📊", title: "Data", items: ["Big data processing", "Real-time analytics", "ETL/ELT pipelines"] },
    { icon: "🔒", title: "Security", items: ["IAM & encryption", "Cloud security", "Compliance frameworks"] }
  ];

  const certifications = [
    { title: "AWS Solutions Architect Associate", icon: "☁️", url: "https://www.credly.com/badges/5a590c66-cc83-4c31-8c07-44245f27dd2a" },
    { title: "AWS AI Practitioner", icon: "🤖", url: "https://www.credly.com/badges/3f988f0a-2835-4af4-8a6c-f64d8d2564a3" },
    { title: "Databricks Lakehouse Fundamentals", icon: "🧱", url: "https://credentials.databricks.com/786390fc-a51c-416c-bd42-38ee5a9dacac" }
  ];

  return (
    <div className="py-20 max-w-6xl mx-auto px-6">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold gradient-text mb-4">LUNDI ZOLISA SILOLO</h1>
        <h2 className="text-2xl text-blue-400 font-mono mb-8">Cloud & AI Solutions Architect</h2>
        
        <div className="matrix-card p-8 rounded-2xl max-w-4xl mx-auto">
          <p className="text-xl text-green-300 mb-6">
            Data & Cloud Professional specializing in AWS serverless architectures, AI/ML solutions, and scalable system design.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skill, i) => (
              <div key={i} className="text-left">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{skill.icon}</span>
                  <h3 className="font-bold text-green-400">{skill.title}</h3>
                </div>
                <ul className="text-cyan-300 text-sm space-y-1 ml-8">
                  {skill.items.map((item, j) => <li key={j}>• {item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile */}
        <div className="matrix-card p-6 rounded-2xl text-center">
          <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
            <img src="/profile.jpg" alt="Profile" className="w-full h-full object-cover" />
          </div>
          
          <h3 className="text-xl font-bold matrix-text mb-4">Contact</h3>
          
          <div className="space-y-3 text-sm text-cyan-300 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Johannesburg, SA</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>zolisasilolo@gmail.com</span>
            </div>
          </div>

          <div className="flex justify-center space-x-3">
            <a href="mailto:zolisasilolo@gmail.com" className="p-2 matrix-card rounded-lg hover:scale-110 transition-transform">
              <Mail className="w-4 h-4 text-green-400" />
            </a>
            <a href="http://linkedin.com/in/lundi-zolisa-s-144922163" className="p-2 matrix-card rounded-lg hover:scale-110 transition-transform">
              <Linkedin className="w-4 h-4 text-cyan-400" />
            </a>
            <a href="https://github.com/ZolisaSilolo" className="p-2 matrix-card rounded-lg hover:scale-110 transition-transform">
              <Github className="w-4 h-4 text-green-400" />
            </a>
          </div>
        </div>

        {/* Experience & Certifications */}
        <div className="lg:col-span-2 space-y-8">
          {/* Experience */}
          <div className="matrix-card p-6 rounded-2xl">
            <h3 className="text-xl font-bold matrix-text mb-4">Experience</h3>
            <div>
              <h4 className="font-semibold text-green-400">AWS Professional Services Intern</h4>
              <p className="text-cyan-400 text-sm mb-3">Amazon Web Services | 2025</p>
              <ul className="text-green-300 text-sm space-y-1">
                <li>• Designed MLOps pipelines using SageMaker and Bedrock</li>
                <li>• Automated serverless solutions with Lambda and Step Functions</li>
                <li>• Supported C-level workshops on AI/ML strategy</li>
              </ul>
            </div>
          </div>

          {/* Certifications */}
          <div className="matrix-card p-6 rounded-2xl">
            <h3 className="text-xl font-bold matrix-text mb-4">Certifications</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {certifications.map((cert, i) => (
                <a key={i} href={cert.url} target="_blank" rel="noopener noreferrer" 
                   className="matrix-card p-4 rounded-lg text-center hover:scale-105 transition-transform">
                  <div className="text-2xl mb-2">{cert.icon}</div>
                  <h4 className="text-green-400 text-xs font-medium mb-1">{cert.title}</h4>
                  <ExternalLink className="w-3 h-3 mx-auto text-cyan-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
