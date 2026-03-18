'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Globe, Loader2, Plus, ArrowUpRight } from 'lucide-react';
import { getFeaturedWebPortfolioItems } from '@/lib/firebase/firestore';
import type { PortfolioItem } from '@/types/firebase';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import GradientButton from '@/components/ui/GradientButton';

// ============================================
// Carte projet web (style hero)
// ============================================

function WebProjectCard({
  item,
  index,
}: {
  item: PortfolioItem;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const coverUrl = item.coverImage?.url || item.imageUrl || '';

  const handleClick = () => {
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
    >
      <button
        onClick={handleClick}
        disabled={!item.url}
        className="group relative w-full text-left overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-indigo-500/40 hover:bg-white/8 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent block"
        aria-label={`Visiter le site : ${item.title}`}
      >
        {/* Hero image — format 16/9 large */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 900px"
              quality={90}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              style={{ objectPosition: item.coverPosition ?? 'center top' }}
            />
          ) : (
            <div className="w-full h-full bg-indigo-950/50 flex items-center justify-center">
              <Globe className="w-12 h-12 text-white/20" />
            </div>
          )}

          {/* Overlay gradient bas */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/10 to-transparent" />

          {/* Badge URL */}
          {item.url && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs text-white/70 backdrop-blur-sm group-hover:border-indigo-500/40 group-hover:text-indigo-300 transition-colors">
                <Globe className="w-3 h-3" />
                Voir le site
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          )}

          {/* Infos en bas de l'image */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                {item.industry && (
                  <span className="inline-block mb-1.5 text-xs text-indigo-300/80 font-medium">
                    {item.industry}
                  </span>
                )}
                <h3 className="text-lg font-semibold text-white group-hover:text-indigo-200 transition-colors leading-tight">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1 text-sm text-white/50 line-clamp-1">{item.description}</p>
                )}
              </div>
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-600/40 transition-colors">
                <ExternalLink className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="px-5 py-3 flex gap-2 flex-wrap border-t border-white/5">
            {item.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-xs text-indigo-300/70 border border-indigo-500/15">
                {tag}
              </span>
            ))}
          </div>
        )}
      </button>
    </motion.div>
  );
}

// ============================================
// Section principale
// ============================================

export default function WebPortfolioSection() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    getFeaturedWebPortfolioItems()
      .then(setItems)
      .catch((err) => console.error('Error loading web portfolio:', err))
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
    <section id="portfolio-web" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-cyan-400 mb-3">Sites & applications web</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Nos réalisations web
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            Sites vitrines, e-commerce et applications — cliquez pour visiter chaque projet en direct.
          </p>
        </motion.div>

        {/* Grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <WebProjectCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <GradientButton href="/portfolio#web" className="px-8 py-3">
            Voir tous les projets web
            <ExternalLink className="w-4 h-4 ml-1" />
          </GradientButton>
        </motion.div>
      </div>
    </section>
  );
}
