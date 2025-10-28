import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Home, User, Briefcase, MessageCircle, Terminal, BookOpen } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'HOME', icon: Home },
    { path: '/blog', label: 'BLOG', icon: BookOpen },
    { path: '/portfolio', label: 'PROJECTS', icon: Briefcase },
    { path: '/chat', label: 'AI_BUDDY', icon: MessageCircle },
    { path: '/about', label: 'ABOUT_ME', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 matrix-card border-b retro-border backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 floating-animation">
            <div className="w-10 h-10 matrix-card rounded-xl flex items-center justify-center glow-effect">
              <Terminal className="w-5 h-5 text-green-400 project-icon-3d" />
            </div>
            <span className="text-xl font-bold matrix-text font-mono">
              &gt; ZOLISA_SILOLO.sys
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 font-mono text-sm ${
                  isActive(path)
                    ? 'matrix-card text-green-400 glow-effect retro-border'
                    : 'hover:matrix-card text-green-300 hover:text-green-400'
                }`}
              >
                <Icon className="w-4 h-4 project-icon-3d" />
                <span className="font-medium">[{label}]</span>
              </Link>
            ))}
            
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl hover:matrix-card transition-all duration-300 glow-effect"
            >
              {isDark ? (
                <Sun className="w-5 h-5 project-icon-3d text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 project-icon-3d text-green-400" />
              )}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:matrix-card transition-all duration-300"
            >
              {isDark ? (
                <Sun className="w-5 h-5 project-icon-3d text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 project-icon-3d text-green-400" />
              )}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl hover:matrix-card transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 project-icon-3d text-green-400" />
              ) : (
                <Menu className="w-6 h-6 project-icon-3d text-green-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-green-400/20 pt-4">
            <div className="space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-mono ${
                    isActive(path)
                      ? 'matrix-card text-green-400'
                      : 'hover:matrix-card text-green-300 hover:text-green-400'
                  }`}
                >
                  <Icon className="w-5 h-5 project-icon-3d" />
                  <span className="font-medium">[{label}]</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
