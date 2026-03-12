'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag, TrendingUp, ChevronRight, Loader2, Plus } from 'lucide-react';
import { getFeaturedPortfolioItems } from '@/lib/firebase/firestore';
import type { PortfolioItem } from '@/types/firebase';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import GradientButton from '@/components/ui/GradientButton';

// ============================================
// Carte projet
// ============================================

function ProjectCard({
  item,
  index,
}: {
  item: PortfolioItem;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const coverUrl = item.coverImage?.url || item.imageUrl || '';

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/portfolio/${item.id}`}
        className="group relative w-full text-left overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-indigo-500/30 hover:bg-white/8 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent block"
        aria-label={`Voir le projet : ${item.title}`}
      >
        {/* Image */}
        <div className="relative aspect-video w-full overflow-hidden">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              style={{ objectPosition: item.coverPosition ?? 'center' }}
            />
          ) : (
            <div className="w-full h-full bg-indigo-950/50 flex items-center justify-center">
              <Plus className="w-8 h-8 text-white/20" />
            </div>
          )}
          {/* Tags overlay */}
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            {item.industry && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 border border-white/10 text-xs text-white/80 backdrop-blur-sm">
                <Tag className="w-2.5 h-2.5" />
                {item.industry}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full bg-black/50 border border-white/10 text-xs text-white/60 backdrop-blur-sm">
              {item.category}
            </span>
          </div>
        </div>

        {/* Infos */}
        <div className="p-5">
          <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
            {item.title}
          </h3>

          {item.result && (
            <div className="mt-2 flex items-start gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-green-400/80 font-medium line-clamp-1">{item.result}</p>
            </div>
          )}

          {!item.result && item.description && (
            <p className="mt-2 text-xs text-white/50 line-clamp-2">{item.description}</p>
          )}

          <div className="mt-4 flex items-center gap-1 text-xs text-white/30 group-hover:text-indigo-400 transition-colors">
            <span>Voir le détail</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================
// Section principale
// ============================================

export default function PortfolioSection() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    getFeaturedPortfolioItems()
      .then(setItems)
      .catch((err) => console.error('Error loading portfolio:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section id="portfolio" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Résultats prouvés</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Des preuves, pas des promesses
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            Chaque projet raconte une transformation réelle — problème, solution, résultat mesurable.
          </p>
        </motion.div>

        {/* Grille 2 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item, index) => (
            <ProjectCard
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </div>

        {/* CTA après grille */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <GradientButton href="/portfolio" className="px-8 py-3">
            Voir tous les projets
            <ChevronRight className="w-4 h-4 ml-1" />
          </GradientButton>
        </motion.div>
      </div>

    </section>
  );
}
