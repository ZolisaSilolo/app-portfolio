import React from 'react';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-divider mt-24" style={{ background: 'rgb(var(--bg-secondary))' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">Z</span>
              </div>
              <span className="font-semibold text-sm" style={{ color: 'rgb(var(--text-primary))' }}>
                Zolisa Silolo
              </span>
            </div>
            <p className="text-sm text-secondary max-w-xs">
              Cloud & AI Solutions Architect building scalable systems on AWS.
            </p>
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

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
              Navigate
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">
                Home
              </Link>
              <Link to="/portfolio" className="text-sm text-secondary hover:text-accent transition-colors">
                Projects
              </Link>
              <Link to="/blog" className="text-sm text-secondary hover:text-accent transition-colors">
                Blog
              </Link>
              <Link to="/about" className="text-sm text-secondary hover:text-accent transition-colors">
                About
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
              Get in touch
            </h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-secondary">
                <MapPin className="w-4 h-4 text-muted" />
                <span>Johannesburg, South Africa</span>
              </div>
              <a
                href="mailto:zolisasilolo@gmail.com"
                className="flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4 text-muted" />
                <span>zolisasilolo@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-divider">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted">
              © {currentYear} Zolisa Silolo. Built with React & AWS.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-muted hover:text-secondary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted hover:text-secondary transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
