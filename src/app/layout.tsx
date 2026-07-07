import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Indigo — Présence digitale & acquisition clients · Martinique & Guadeloupe',
  description:
    "Packs de présence numérique pour TPE aux Antilles : identité visuelle, contenu Instagram, page de conversion et campagne Meta Ads. L'objectif : générer des demandes qualifiées.",
  openGraph: {
    title: 'Indigo — Présence digitale & acquisition clients',
    description:
      "Image, contenu, page de conversion et campagne publicitaire : la base digitale complète pour attirer des clients en Martinique et Guadeloupe.",
    locale: 'fr_FR',
    type: 'website',
  },
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
