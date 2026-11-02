import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-divider mt-24 bg-zinc-950/60 dark:bg-zinc-950/80 light:bg-zinc-50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm shadow-cyan-500/20">
                <span className="text-white font-bold text-xs">Z</span>
              </div>
              <span className="font-semibold text-sm tracking-tight text-zinc-100">
                Zolisa Silolo
              </span>
            </div>
            <p className="text-xs text-secondary max-w-xs leading-relaxed">
              Cloud &amp; AI Solutions Architect building resilient, high-throughput serverless systems on AWS.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://github.com/ZolisaSilolo"
                target="_blank"
                rel="noopener noreferrer"
                className="icon-box !w-8 !h-8"
                aria-label="GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href="http://linkedin.com/in/lundi-zolisa-s-144922163"
                target="_blank"
                rel="noopener noreferrer"
                className="icon-box !w-8 !h-8"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href="mailto:zolisasilolo@gmail.com"
                className="icon-box !w-8 !h-8"
                aria-label="Email"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Navigation
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-xs text-secondary hover:text-cyan-400 transition-colors">
                Home
              </Link>
              <Link to="/portfolio" className="text-xs text-secondary hover:text-cyan-400 transition-colors">
                Architectural Projects
              </Link>
              <Link to="/blog" className="text-xs text-secondary hover:text-cyan-400 transition-colors">
                Technical Blog
              </Link>
              <Link to="/chat" className="text-xs text-secondary hover:text-cyan-400 transition-colors">
                AI Buddy
              </Link>
              <Link to="/about" className="text-xs text-secondary hover:text-cyan-400 transition-colors">
                About &amp; Certifications
              </Link>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Location &amp; Inquiries
            </h4>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs text-secondary">
                <MapPin className="w-3.5 h-3.5 text-muted shrink-0" />
                <span>Johannesburg, South Africa (UTC+2)</span>
              </div>
              <a
                href="mailto:zolisasilolo@gmail.com"
                className="flex items-center gap-2 text-xs text-secondary hover:text-cyan-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-muted shrink-0" />
                <span>zolisasilolo@gmail.com</span>
              </a>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Remote &amp; Global Availability
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - with TypeScript, React, Tailwind CSS removed */}
        <div className="mt-12 pt-6 border-t border-divider">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted font-mono">
              © {currentYear} Zolisa Silolo. Serverless Architecture on AWS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
