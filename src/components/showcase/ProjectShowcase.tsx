'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { getHomeProjectsForDisplay } from '@/lib/firebase/firestore';
import type { HomeProject } from '@/types/firebase';
import type { BusinessCategory } from '@/config/business-categories';
import ProjectMosaicCard from './ProjectMosaicCard';
import FadeCarousel from './FadeCarousel';
import { WhatsAppButton } from '@/components/home/funnel/WhatsApp';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

type Filter = 'all' | BusinessCategory;

export default function ProjectShowcase() {
  const [items, setItems] = useState<HomeProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const reduce = useReducedMotion();

  useEffect(() => {
    getHomeProjectsForDisplay()
      .then(setItems)
      .catch(err => console.error('Error loading showcase projects:', err))
      .finally(() => setIsLoading(false));
  }, []);

  // Onglets construits uniquement à partir des catégories réellement présentes
  // — pas la liste fixe entière (évite un onglet vide sans projet derrière).
  const categories = useMemo(() => {
    const set = new Set<BusinessCategory>();
    items.forEach(item => {
      if (item.businessCategory) set.add(item.businessCategory);
    });
    return Array.from(set);
  }, [items]);

  // Tous les projets de la catégorie (le carrousel les fait défiler en boucle,
  // 2 par page — plus de limite à 4).
  const filteredItems = filter === 'all' ? items : items.filter(i => i.businessCategory === filter);

  if (isLoading) {
    return (
      <section className="w-full py-20 px-4">
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section id="realisations" className="w-full py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Concrètement, ça donne ça</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Des entreprises comme la vôtre, méconnaissables
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            Voici des marques que j'ai créées de A à Z. Regardez le résultat — cliquez pour voir de plus près.
          </p>
        </motion.div>

        {/* Filtres par catégorie métier */}
        {categories.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap mb-10 border-b border-white/10 pb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-white text-gray-950' : 'text-white/50 hover:text-white'
              }`}
            >
              Tous
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === cat ? 'bg-white text-gray-950' : 'text-white/50 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Carrousel timé — 2 projets par ligne, remplacés en fondu, en boucle
            sur tout le catalogue. Flèches + points pour naviguer manuellement. */}
        <FadeCarousel
          items={filteredItems}
          perPage={2}
          intervalMs={4000}
          getKey={(item) => item.id}
          gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-6"
          renderItem={(item) => <ProjectMosaicCard item={item} />}
        />

        <motion.div
          initial={reduce ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <WhatsAppButton label="Je veux un résultat comme ça" size="md" />
        </motion.div>
      </div>
    </section>
  );
}
