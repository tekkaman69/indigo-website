'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, LogIn, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import GradientButton from '../ui/GradientButton';
import { Button } from '../ui/button';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { isAdminUid } from '@/lib/admin';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { name: 'Accueil', href: '/' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Contact', href: '/contact' },
];

const Header = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isAdminUid(user.uid)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de se déconnecter',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Déconnexion réussie',
        description: 'À bientôt !',
      });
      router.push('/');
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-white/10'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          <span className="bg-gradient-to-r from-primary via-accent to-cyan-400 bg-clip-text text-transparent">
            Indigo
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin/portfolio"
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80 flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              Portfolio Admin
            </Link>
          )}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {isAdmin ? (
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Indigo
              <LogOut className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Link href="/admin/login">
                <LogIn className="w-4 h-4" />
                Admin
              </Link>
            </Button>
          )}
          <GradientButton href="/contact">Demander un devis</GradientButton>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-lg pb-4"
        >
          <nav className="flex flex-col items-center gap-4 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-medium text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin/portfolio"
                className="text-lg font-medium text-primary flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="w-4 h-4" />
                Portfolio Admin
              </Link>
            )}
            {isAdmin ? (
              <Button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Indigo
                <LogOut className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/admin/login">
                  <LogIn className="w-4 h-4" />
                  Admin
                </Link>
              </Button>
            )}
            <GradientButton href="/contact" onClick={() => setIsMenuOpen(false)}>
              Demander un devis
            </GradientButton>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
