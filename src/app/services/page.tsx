'use client';
// Marketplace à la carte désactivée — redirige vers les formules de la landing page
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/#services');
  }, [router]);
  return null;
}
