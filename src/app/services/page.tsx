'use client';
// Marketplace à la carte supprimée — redirige vers les packs de la home
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/#offres');
  }, [router]);
  return null;
}
