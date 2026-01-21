import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Indigo — Création & Automatisation',
  description: 'Agence de création de contenu, branding, et automatisations pour booster votre présence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-body antialiased`} suppressHydrationWarning>
        <ConditionalLayout>{children}</ConditionalLayout>
        <Toaster />
      </body>
    </html>
  );
}
