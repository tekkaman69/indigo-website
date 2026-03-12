'use client';

import Link from 'next/link';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { PlayCircle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getPortfolioItems } from '@/lib/firebase/firestore';
import type { PortfolioItem } from '@/types/firebase';
import { SectionHeader } from '../ui/SectionHeader';

// Nombre total d'emplacements à afficher
const TOTAL_SLOTS = 6;

type ProjectItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  coverPosition?: string;
  category: string;
  isVideo: boolean;
};

const ProjectCard = ({ item }: { item: ProjectItem }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="w-full"
  >
    <Link href={`/portfolio/${item.id}`}>
      <Card className="group relative overflow-hidden rounded-xl border-white/10 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 h-full">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              style={{ objectPosition: item.coverPosition || 'center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300 group-hover:from-black/60" />

            {/* Play icon for videos */}
            {item.isVideo && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <PlayCircle className="w-14 h-14 text-white/50 transition-all duration-300 group-hover:text-white/90 group-hover:scale-110" strokeWidth={1} />
              </div>
            )}

            {/* Category tag */}
            <div className="absolute top-4 right-4 bg-black/40 text-white/90 text-xs px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
              {item.category}
            </div>

            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-white/70 mt-1 line-clamp-2">{item.description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
);

const EmptySlot = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
    className="w-full"
  >
    <Card className="relative overflow-hidden rounded-xl border-dashed border-2 border-muted-foreground/20 bg-muted/5 transition-all duration-300 hover:border-muted-foreground/40 hover:bg-muted/10">
      <CardContent className="p-0 flex flex-col items-center justify-center aspect-video">
        <Plus className="w-10 h-10 text-muted-foreground/30 mb-2" />
        <p className="text-muted-foreground/50 text-sm">Projet à venir</p>
      </CardContent>
    </Card>
  </motion.div>
);

const FeaturedWork = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProjects = async () => {
      try {
        const items = await getPortfolioItems();
        const featured = items
          .filter(p => p.featured)
          .slice(0, TOTAL_SLOTS)
          .map(item => ({
            id: item.id,
            title: item.title,
            description: item.description || '',
            imageUrl: item.coverImage?.url || item.imageUrl || '',
            coverPosition: item.coverPosition || 'center',
            category: item.categories?.[0] || item.category || 'Projet',
            isVideo: item.category?.toLowerCase().includes('video') ||
                     item.category?.toLowerCase().includes('vidéo') ||
                     item.category?.toLowerCase().includes('publicité') ||
                     item.category?.toLowerCase().includes('motion'),
          }));

        setProjects(featured);
      } catch (error) {
        console.error('Error loading featured projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFeaturedProjects();
  }, []);

  // Calculer le nombre d'emplacements vides à afficher
  const emptySlots = Array.from({ length: Math.max(0, TOTAL_SLOTS - projects.length) });

  return (
    <section id="portfolio" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          title="Nos Réalisations"
          description="Un aperçu de projets où nous avons transformé des idées en succès."
          maxWidth="3xl"
        />

        {/* Grille unifiée */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} item={project} />
          ))}
          {emptySlots.map((_, i) => (
            <EmptySlot key={`empty-${i}`} index={i} />
          ))}
        </div>

        {/* Lien vers le portfolio complet */}
        {projects.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Voir tous les projets
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedWork;
