import React from 'react';
import { Heart, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-200/20">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-cyan-50/20 to-sky-50/30 dark:from-blue-900/10 dark:via-cyan-900/5 dark:to-sky-900/10"></div>
      
      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold gradient-text">Zolisa Silolo</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
              Cloud Solutions Architect & AI Engineer passionate about creating 
              innovative digital experiences with cutting-edge technologies.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com" 
                className="p-3 modern-card rounded-xl hover:scale-110 transition-all duration-300 glow-effect"
              >
                <Github className="w-5 h-5 icon-3d" />
              </a>
              <a 
                href="https://linkedin.com" 
                className="p-3 modern-card rounded-xl hover:scale-110 transition-all duration-300 glow-effect"
              >
                <Linkedin className="w-5 h-5 icon-3d text-blue-600" />
              </a>
              <a 
                href="mailto:contact@zolisasilolo.com" 
                className="p-3 modern-card rounded-xl hover:scale-110 transition-all duration-300 glow-effect"
              >
                <Mail className="w-5 h-5 icon-3d text-green-600" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Quick Links</h4>
            <div className="space-y-2">
              {['Home', 'About', 'Portfolio', 'Chat'].map((link) => (
                <a 
                  key={link}
                  href={`/${link.toLowerCase() === 'home' ? '' : link.toLowerCase()}`}
                  className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Get In Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <MapPin className="w-4 h-4 icon-3d text-blue-600" />
                <span className="text-sm">Johannesburg, South Africa</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <Mail className="w-4 h-4 icon-3d text-green-600" />
                <span className="text-sm">contact@zolisasilolo.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <Phone className="w-4 h-4 icon-3d text-cyan-600" />
                <span className="text-sm">Available for consultation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <span className="text-sm">© 2024 Zolisa Silolo. Built with</span>
              <Heart className="w-4 h-4 icon-3d text-red-500" />
              <span className="text-sm">using React & AWS</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-cyan-600/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-sky-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
    </footer>
  );
};

export default Footer;
