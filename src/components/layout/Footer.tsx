import Link from 'next/link';
import { Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/10 mt-24 py-8">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <Link href="/" className="text-2xl font-bold tracking-tighter mb-2 inline-block">
            <span className="bg-gradient-to-r from-primary via-accent to-cyan-400 bg-clip-text text-transparent">
              Indigo
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">&copy; {year} Indigo. Tous droits réservés.</p>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#" aria-label="Twitter">
            <Twitter className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
          </Link>
          <Link href="#" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
          </Link>
          <Link href="#" aria-label="Instagram">
            <Instagram className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
