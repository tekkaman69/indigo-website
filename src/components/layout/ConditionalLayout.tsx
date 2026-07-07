'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { Background } from './Background';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isEditorRoute = pathname?.startsWith('/admin/portfolio/editor');
  // La home gère son propre fond (hero coloré + sections sombres). Les autres
  // pages reçoivent le fond animé statique.
  const isFunnelHome = pathname === '/';

  if (isEditorRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Fond sombre uni sur la home (pas de shader → navbar/footer propres) */}
      {isFunnelHome ? (
        <div className="fixed inset-0 -z-50 bg-[#050509]" aria-hidden="true" />
      ) : (
        <Background />
      )}
      <Header />
      <main className="relative z-10 pt-16">{children}</main>
      <Footer />
    </>
  );
}
