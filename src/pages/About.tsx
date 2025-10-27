import React from 'react';
import { Award, MapPin, Calendar, Mail, Linkedin, Github, ExternalLink } from 'lucide-react';

const About = () => {
  const skillCategories = [
    {
      title: "Cloud Platforms & Architecture",
      skills: [
        "AWS (Expert) - Solutions Architecture & Implementation",
        "Azure (Intermediate) - Multi-cloud strategies", 
        "Serverless Architecture - Event-driven solutions",
        "Infrastructure-as-Code (IaC) - CloudFormation & Terraform"
      ]
    },
    {
      title: "AI/ML & Data Science", 
      skills: [
        "Amazon SageMaker - ML model development & deployment",
        "Amazon Bedrock - Generative AI applications",
        "Predictive Analytics - Business intelligence solutions",
        "Databricks - Big data processing & analytics",
        "MLOps - ML lifecycle management"
      ]
    },
    {
      title: "Programming & Automation",
      skills: [
        "Python - Primary development language",
        "SQL - Database querying & optimization", 
        "Bash - System automation & scripting",
        "REST APIs - Service integration",
        "CI/CD Pipelines - Automated deployments"
      ]
    },
    {
      title: "Data Engineering",
      skills: [
        "Data Lakes - Scalable data storage solutions",
        "Real-Time Analytics - Stream processing", 
        "Big Data Processing - Large-scale data workflows",
        "ETL/ELT Pipelines - Data transformation"
      ]
    },
    {
      title: "Security & Compliance",
      skills: [
        "IAM - Identity & access management",
        "Cloud Security - Multi-layer protection",
        "Encryption - Data protection at rest & in transit",
        "Digital Sovereignty - Compliance frameworks"
      ]
    },
    {
      title: "IoT & Systems",
      skills: [
        "AWS IoT Core - Device connectivity & management",
        "MQTT Protocol - Lightweight messaging", 
        "Edge Computing - Distributed processing",
        "Microservices Architecture - Scalable system design"
      ]
    },
    {
      title: "DevOps & Containerization",
      skills: [
        "Docker - Container orchestration",
        "Container Orchestration - Scalable deployments",
        "Microservices - Distributed system architecture",
        "Infrastructure Monitoring - CloudWatch & observability"
      ]
    }
  ];

  const certifications = [
    {
      title: "AWS Certified Solutions Architect – Associate",
      icon: "☁️",
      url: "https://www.credly.com/badges/5a590c66-cc83-4c31-8c07-44245f27dd2a/linked_in_profile"
    },
    {
      title: "AWS Knowledge: Events & Workflow", 
      icon: "🤖",
      url: "https://www.credly.com/badges/436dca12-95c3-4086-869d-bcdef68c2447/linked_in_profile"
    },
    {
      title: "Databricks Lakehouse Fundamentals",
      icon: "🧱",
      url: "https://credentials.databricks.com/786390fc-a51c-416c-bd42-38ee5a9dacac"
    },
    {
      title: "AWS Well-Architected Proficient",
      icon: "🏆", 
      url: "https://www.credly.com/badges/83f3ee22-5f6c-4446-914b-0cb5ccb38b61/linked_in_profile"
    },
    {
      title: "AWS Partner: Generative AI Essentials",
      icon: "🧠", 
      url: "https://www.credly.com/badges/e5c13153-48e3-452d-92e2-a66b504bc3bd/linked_in_profile"
    },
    {
      title: "AWS AI Practitioner",
      icon: "🔷",
      url: "https://www.credly.com/badges/3f988f0a-2835-4af4-8a6c-f64d8d2564a3/linked_in_profile"
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-12">
            <div className="inline-block px-6 py-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-800 dark:text-green-300 text-sm font-medium mb-8">
              [SYSTEM_INITIALIZED] ✓
            </div>
            <h1 className="text-6xl font-bold gradient-text mb-4 tracking-wide">LUNDI ZOLISA</h1>
            <h2 className="text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-12 font-mono">SILOLO.exe</h2>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="modern-card p-10 rounded-3xl text-left space-y-8">
              <div className="flex items-center mb-8">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-4"></div>
                <span className="text-green-600 dark:text-green-400 font-mono text-base">[LOADING...] Professional Profile</span>
              </div>
              
              <div className="text-center mb-10">
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
                  Data & Cloud Professional with hands-on experience designing secure, scalable architectures and driving AI-powered innovation. I specialize in solving real-world challenges through cloud-native, data-driven, and machine learning solutions.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="flex items-start space-x-4">
                      <span className="text-2xl">☁️</span>
                      <div>
                        <h3 className="font-bold text-blue-600 dark:text-blue-400 text-lg mb-2">Cloud</h3>
                        <p className="text-gray-600 dark:text-gray-400">AWS, Serverless Architectures, Cloud Security, Infrastructure-as-Code</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <div className="flex items-start space-x-4">
                      <span className="text-2xl">🤖</span>
                      <div>
                        <h3 className="font-bold text-purple-600 dark:text-purple-400 text-lg mb-2">Data & AI</h3>
                        <p className="text-gray-600 dark:text-gray-400">Big Data Solutions, Analytics, Amazon SageMaker AI, Bedrock, MLOps</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="flex items-start space-x-4">
                      <span className="text-2xl">⚙️</span>
                      <div>
                        <h3 className="font-bold text-green-600 dark:text-green-400 text-lg mb-2">Systems</h3>
                        <p className="text-gray-600 dark:text-gray-400">Distributed, Highly-Available, IoT-enabled infrastructures</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                    <div className="flex items-start space-x-4">
                      <span className="text-2xl">📈</span>
                      <div>
                        <h3 className="font-bold text-orange-600 dark:text-orange-400 text-lg mb-2">Business Impact</h3>
                        <p className="text-gray-600 dark:text-gray-400">Translating advanced technologies into solutions that drive efficiency, resilience, and growth</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <div className="text-center">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
                    Beyond the tech, I thrive on principles like <span className="font-semibold text-blue-600 dark:text-blue-400 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded">customer obsession</span>, <span className="font-semibold text-green-600 dark:text-green-400 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded">bias for action</span>, and <span className="font-semibold text-purple-600 dark:text-purple-400 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded">delivering results</span>. My strength lies in bridging complex business challenges with cutting-edge technology, ensuring solutions are not only robust and secure, but also strategically valuable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="modern-card p-8 rounded-3xl text-center floating-animation">
              <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden glow-effect">
                <img src="/profile.jpg" alt="Lundi Zolisa Silolo" className="w-full h-full object-cover" />
              </div>
              
              <h2 className="text-2xl font-bold gradient-text mb-2">Lundi Zolisa Silolo</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                AWS Certified Cloud & Data Professional | AI/ML Solutions Architect
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-5 h-5 icon-3d text-blue-600" />
                  <span>Johannesburg, South Africa</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                  <Mail className="w-5 h-5 icon-3d text-green-600" />
                  <span>zolisasilolo@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                  <Award className="w-5 h-5 icon-3d text-yellow-600" />
                  <span>AWS Solutions Architect Associate</span>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <a href="mailto:zolisasilolo@gmail.com" className="p-3 modern-card rounded-xl hover:scale-110 transition-all duration-300 glow-effect">
                  <Mail className="w-5 h-5 icon-3d text-blue-600" />
                </a>
                <a href="http://linkedin.com/in/lundi-zolisa-s-144922163" className="p-3 modern-card rounded-xl hover:scale-110 transition-all duration-300 glow-effect">
                  <Linkedin className="w-5 h-5 icon-3d text-blue-600" />
                </a>
                <a href="https://github.com/ZolisaSilolo" className="p-3 modern-card rounded-xl hover:scale-110 transition-all duration-300 glow-effect">
                  <Github className="w-5 h-5 icon-3d" />
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Professional Experience */}
            <div className="modern-card p-8 rounded-2xl">
              <h3 className="text-2xl font-bold gradient-text mb-6">Professional Experience</h3>
              
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AWS Professional Services Intern</h4>
                <p className="text-blue-600 dark:text-blue-400 mb-4">Amazon Web Services | Johannesburg, South Africa | 2025</p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Designed and deployed MLOps pipelines using Amazon SageMaker and Bedrock for AI/ML workflows</li>
                  <li>• Automated cloud-native solutions with AWS Lambda, Step Functions, and Infrastructure-as-Code</li>
                  <li>• Supported workshops for C-level executives on big data, AI/ML strategy, and cloud transformation</li>
                  <li>• Enhanced client satisfaction by optimizing solution delivery pipelines and addressing technical bottlenecks</li>
                </ul>
              </div>

              <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Focus Areas</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>Cloud Architecture & Serverless Solutions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>AI/ML & Generative AI</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>MLOps & Big Data Analytics</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>IoT & Cloud Security</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>Infrastructure-as-Code (IaC)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>Enterprise Consulting & Automation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Skills */}
            <div className="modern-card p-8 rounded-2xl">
              <h3 className="text-2xl font-bold gradient-text mb-6">Personal Skills</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">•</span>
                    <span>Strong communication skills 📣</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">•</span>
                    <span>Analytical problem-solving abilities 🧩</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">•</span>
                    <span>Team collaboration and leadership 👥</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">•</span>
                    <span>Continuous learning mindset 🌱</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-center">
                  💡 I'm always looking for new opportunities to learn and grow, so feel free to reach out!
                </p>
              </div>
            </div>

            {/* Technical Expertise */}
            <div className="modern-card p-8 rounded-2xl">
              <h3 className="text-2xl font-bold gradient-text mb-8">🛠️ Technical Expertise</h3>
              <div className="grid gap-6">
                {skillCategories.map((category, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{category.title}</h4>
                    <div className="space-y-2">
                      {category.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className="text-gray-600 dark:text-gray-300 text-sm">
                          • {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AWS Certifications */}
            <div className="modern-card p-8 rounded-2xl">
              <h3 className="text-2xl font-bold gradient-text mb-8">🏆 Professional Certifications</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {certifications.map((cert, index) => (
                  <a
                    key={index}
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modern-card p-6 rounded-xl text-center hover:scale-105 transition-all duration-300 glow-effect"
                  >
                    {cert.title === "AWS Certified Solutions Architect – Associate" ? (
                      <div className="w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden">
                        <img src="/aws-cert.jpg" alt="AWS Certificate" className="w-full h-full object-cover" />
                      </div>
                    ) : cert.title === "AWS Partner: Generative AI Essentials" ? (
                      <div className="w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden">
                        <img src="/genai-cert.jpg" alt="GenAI Certificate" className="w-full h-full object-cover" />
                      </div>
                    ) : cert.title === "AWS Knowledge: Events & Workflow" ? (
                      <div className="w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden">
                        <img src="/events-workflow-cert.jpg" alt="Events & Workflow Certificate" className="w-full h-full object-cover" />
                      </div>
                    ) : cert.title === "AWS Well-Architected Proficient" ? (
                      <div className="w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden">
                        <img src="/well-architected-cert.jpg" alt="Well-Architected Certificate" className="w-full h-full object-cover" />
                      </div>
                    ) : cert.title === "AWS AI Practitioner" ? (
                      <div className="w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden">
                        <img src="/ai-practitioner-cert.jpg" alt="AI Practitioner Certificate" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="text-4xl mb-4">{cert.icon}</div>
                    )}
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">{cert.title}</h4>
                    <div className="flex items-center justify-center space-x-1 text-blue-600">
                      <span className="text-sm">View Badge</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
