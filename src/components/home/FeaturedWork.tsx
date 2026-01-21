'use client';

import Link from 'next/link';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { getPortfolioItems } from '@/lib/firebase/firestore';
import type { PortfolioItem } from '@/types/firebase';

import { SectionHeader } from '../ui/SectionHeader';

type FeaturedWorkItem = {
  type: 'video' | 'branding';
  title: string;
  subtitle: string;
  imagePoster: string;
  imageHint?: string;
  coverPosition?: string;
  tag: string;
  href: string;
  slug: string;
};

const VideoCard = ({ item }: { item: FeaturedWorkItem }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="w-full"
  >
    <Link href={item.href}>
      <Card className="group relative overflow-hidden rounded-xl border-white/10 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 h-full">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative h-60 md:h-80 w-full overflow-hidden">
            <Image
              src={item.imagePoster}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              style={{ objectPosition: item.coverPosition || 'center' }}
              data-ai-hint={item.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 transition-opacity duration-300 group-hover:from-black/80" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 scanline" />
            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="absolute top-4 right-4 bg-black/30 text-white/80 text-xs px-2 py-1 rounded-full border border-white/20 backdrop-blur-sm">
              {item.tag}
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
              <p className="text-sm text-white/80 mt-1">{item.subtitle}</p>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <PlayCircle className="w-16 h-16 text-white/40 transition-all duration-300 group-hover:text-white/80 group-hover:scale-110" strokeWidth={1} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
);

const BrandingCard = ({ item }: { item: FeaturedWorkItem }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="w-full"
  >
    <Link href={item.href}>
      <Card className="group relative overflow-hidden rounded-xl border-white/10 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 h-full">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative w-full aspect-video overflow-hidden">
            <Image
              src={item.imagePoster}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ objectPosition: item.coverPosition || 'center' }}
              data-ai-hint={item.imageHint}
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-semibold text-lg flex-grow">{item.title}</h3>
            <div className="mt-2">
              <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                {item.tag}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
);


const FeaturedWork = () => {
  const [videoItems, setVideoItems] = useState<FeaturedWorkItem[]>([]);
  const [brandingItems, setBrandingItems] = useState<FeaturedWorkItem[]>([]);

  useEffect(() => {
    const loadFeaturedProjects = async () => {
      try {
        const projects = await getPortfolioItems();
        const featured = projects.filter(p => p.featured);

        const videos = featured
          .filter(item => item.category?.toLowerCase().includes('video') || item.category?.toLowerCase().includes('publicité'))
          .slice(0, 2)
          .map(item => ({
            type: 'video' as const,
            title: item.title,
            subtitle: item.description || '',
            imagePoster: item.coverImage?.url || item.imageUrl || '',
            imageHint: item.coverImage?.hint || item.title,
            coverPosition: item.coverPosition || 'center',
            tag: item.categories?.[0] || item.category || 'Vidéo',
            href: `/portfolio/${item.id}`,
            slug: item.id,
          }));

        const brandings = featured
          .filter(item => !item.category?.toLowerCase().includes('video') && !item.category?.toLowerCase().includes('publicité'))
          .slice(0, 3)
          .map(item => ({
            type: 'branding' as const,
            title: item.title,
            subtitle: item.description || '',
            imagePoster: item.coverImage?.url || item.imageUrl || '',
            imageHint: item.coverImage?.hint || item.title,
            coverPosition: item.coverPosition || 'center',
            tag: item.categories?.[0] || item.category || 'Branding',
            href: `/portfolio/${item.id}`,
            slug: item.id,
          }));

        setVideoItems(videos);
        setBrandingItems(brandings);
      } catch (error) {
        console.error('Error loading featured projects:', error);
      }
    };
    loadFeaturedProjects();
  }, []);

  const emptyVideoSlots = Array.from({ length: Math.max(0, 2 - videoItems.length) });
  const emptyBrandingSlots = Array.from({ length: Math.max(0, 3 - brandingItems.length) });

  return (
    <section id="portfolio" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader title="Nos Réalisations" description="Un aperçu de projets où nous avons transformé des idées en succès, de la publicité vidéo à l'identité de marque." maxWidth="3xl" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {videoItems.map((item) => (
            <VideoCard key={item.slug || item.title} item={item} />
          ))}
          {emptyVideoSlots.map((_, i) => (
            <Card key={`empty-video-${i}`} className="relative overflow-hidden rounded-xl border-dashed border-2 border-muted-foreground/20 bg-muted/5">
              <CardContent className="p-0 flex items-center justify-center h-60 md:h-80">
                <p className="text-muted-foreground/50 text-sm">Emplacement vidéo</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandingItems.map((item) => (
            <BrandingCard key={item.slug} item={item} />
          ))}
          {emptyBrandingSlots.map((_, i) => (
            <Card key={`empty-branding-${i}`} className="relative overflow-hidden rounded-xl border-dashed border-2 border-muted-foreground/20 bg-muted/5">
              <CardContent className="p-0 flex items-center justify-center h-48">
                <p className="text-muted-foreground/50 text-sm">Emplacement projet</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWork;
