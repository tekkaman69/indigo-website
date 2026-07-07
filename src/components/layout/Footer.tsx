import Link from 'next/link';

const footerLinks = [
  { name: 'Réalisations', href: '/#realisations' },
  { name: 'Nos offres', href: '/#offres' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Contact', href: '/contact' },
  { name: 'Admin', href: '/admin/login' },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#070815] py-8">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <Link href="/" className="text-2xl font-bold tracking-tighter mb-2 inline-block">
            <span className="bg-gradient-to-r from-primary via-accent to-cyan-400 bg-clip-text text-transparent">
              Indigo
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">&copy; {year} Indigo · Martinique & Guadeloupe. Tous droits réservés.</p>
        </div>
        <nav className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
