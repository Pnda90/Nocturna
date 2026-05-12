import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { LanguageToggle } from './LanguageToggle';
import { AudioToggle } from './AudioToggle';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { language } = useAppStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/ouija', label: t(language, 'nav.ouija') },
    { path: '/stories', label: t(language, 'nav.stories') },
    { path: '/settings', label: t(language, 'nav.settings') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="font-serif text-xl md:text-2xl font-light tracking-[0.2em] text-foreground hover:text-primary transition-colors duration-300"
          >
            NOCTURNA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm tracking-widest uppercase transition-all duration-300 relative ${
                  isActive(item.path)
                    ? 'text-primary glow-ghost-text'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-primary/50" />
                )}
              </Link>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <AudioToggle />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav 
            className="md:hidden py-4 border-t border-border/30 animate-fade-in"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm tracking-widest uppercase py-2 transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-primary glow-ghost-text'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
