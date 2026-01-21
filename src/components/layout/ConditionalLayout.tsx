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

  if (isEditorRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Background />
      <Header />
      <main className="relative z-10">{children}</main>
      <Footer />
    </>
  );
}
