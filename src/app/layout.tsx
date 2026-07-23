import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Indigo — Une image pro pour attirer plus de clients',
  description:
    "Logo, réseaux, site et publicités : un designer français s'occupe de tout pour donner à votre entreprise une image qui inspire confiance et vous ramène des clients.",
  openGraph: {
    title: 'Indigo — Une image pro pour attirer plus de clients',
    description:
      "Logo, réseaux, site et publicités : un designer s'occupe de tout pour donner à votre entreprise une image qui inspire confiance et vous ramène des clients.",
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
