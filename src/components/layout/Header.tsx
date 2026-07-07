'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { waUrl } from '@/components/home/funnel/WhatsApp';

const navItems = [
  { name: 'Nos offres', href: '/#offres' },
  { name: 'Portfolio', href: '/portfolio' },
];

const WA_MSG = "Bonjour, je viens de votre site et j'aimerais en savoir plus.";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  // La home (funnel) garde une navbar toujours transparente — esthétique ACA
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? isHome
            ? 'bg-[#050509] border-b border-white/10' // home : noir uni opaque (lisibilité)
            : 'bg-background/80 backdrop-blur-lg border-b border-white/10'
          : 'bg-transparent'
      )}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tighter" aria-label="Indigo — accueil">
          <span className="bg-gradient-to-r from-primary via-accent to-cyan-400 bg-clip-text text-transparent">
            Indigo
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="flex items-center gap-5">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hidden sm:block text-xs text-white/40 hover:text-white/80 transition-colors"
            >
              {item.name}
            </Link>
          ))}

          <a
            href={waUrl(WA_MSG)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] text-xs font-semibold transition-colors"
            aria-label="Nous contacter sur WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>

          {/* Burger mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden text-white/70 hover:text-white transition-colors"
            aria-label="Ouvrir le menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-lg border-b border-white/10"
          >
            <nav className="flex flex-col px-6 py-4 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="py-2.5 text-sm text-white/60 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
