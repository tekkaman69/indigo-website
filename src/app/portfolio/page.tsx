'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getPortfolioItems } from '@/lib/firebase/firestore';
import type { PortfolioItem } from '@/types/firebase';
import { Loader2, ExternalLink, Globe, ArrowUpRight, Tag, TrendingUp } from 'lucide-react';
import Template from '../template';

// ============================================
// Carte graphisme
// ============================================

function GraphismeCard({ item, index }: { item: PortfolioItem; index: number }) {
  const coverUrl = item.coverImage?.url || item.imageUrl || '';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link
        href={`/portfolio/${item.id}`}
        className="group relative w-full text-left overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-indigo-500/30 hover:bg-white/8 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 block"
        aria-label={`Voir le projet : ${item.title}`}
      >
        <div className="relative aspect-video w-full overflow-hidden">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ objectPosition: item.coverPosition ?? 'center' }}
            />
          ) : (
            <div className="w-full h-full bg-indigo-950/50 flex items-center justify-center">
              <Tag className="w-8 h-8 text-white/20" />
            </div>
          )}
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
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================
// Carte web (hero avec lien externe)
// ============================================

function WebCard({ item, index }: { item: PortfolioItem; index: number }) {
  const coverUrl = item.coverImage?.url || item.imageUrl || '';
  const handleClick = () => {
    if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <button
        onClick={handleClick}
        disabled={!item.url}
        className="group relative w-full text-left overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-cyan-500/40 hover:bg-white/8 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 block"
        aria-label={`Visiter le site : ${item.title}`}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 900px"
              quality={90}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              style={{ objectPosition: item.coverPosition ?? 'center top' }}
            />
          ) : (
            <div className="w-full h-full bg-cyan-950/30 flex items-center justify-center">
              <Globe className="w-12 h-12 text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/10 to-transparent" />

          {item.url && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs text-white/70 backdrop-blur-sm group-hover:border-cyan-500/40 group-hover:text-cyan-300 transition-colors">
                <Globe className="w-3 h-3" />
                Voir le site
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                {item.industry && (
                  <span className="inline-block mb-1.5 text-xs text-cyan-300/80 font-medium">{item.industry}</span>
                )}
                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-200 transition-colors leading-tight">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1 text-sm text-white/50 line-clamp-1">{item.description}</p>
                )}
              </div>
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-600/40 transition-colors">
                <ExternalLink className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="px-5 py-3 flex gap-2 flex-wrap border-t border-white/5">
            {item.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-xs text-cyan-300/70 border border-cyan-500/15">
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
// Page principale
// ============================================

export default function PortfolioPage() {
  const [allItems, setAllItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'graphisme' | 'web'>('graphisme');
  const webRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPortfolioItems()
      .then((items) => setAllItems(items.filter(i => i.published !== false)))
      .catch((err) => console.error('Error loading portfolio:', err))
      .finally(() => setIsLoading(false));
  }, []);

  // Lire l'ancre #web au chargement
  useEffect(() => {
    if (window.location.hash === '#web') {
      setActiveTab('web');
    }
  }, []);

  const graphismeItems = allItems.filter(i => !i.type || i.type === 'graphisme');
  const webItems = allItems.filter(i => i.type === 'web');

  return (
    <Template>
      <div className="w-full min-h-screen">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Studio Indigo</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Nos réalisations
            </h1>
            <p className="mt-4 text-lg text-white/50">
              Identité visuelle, branding et sites web — chaque projet, une transformation réelle.
            </p>
          </div>

          {/* Onglets */}
          <div className="flex justify-center mb-10" ref={webRef}>
            <div className="inline-flex rounded-full bg-white/5 border border-white/10 p-1 gap-1">
              <button
                onClick={() => setActiveTab('graphisme')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === 'graphisme'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                Graphisme
                {graphismeItems.length > 0 && (
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'graphisme' ? 'bg-white/20' : 'bg-white/10'}`}>
                    {graphismeItems.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('web')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === 'web'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                Web
                {webItems.length > 0 && (
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'web' ? 'bg-white/20' : 'bg-white/10'}`}>
                    {webItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Contenu */}
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            </div>
          ) : activeTab === 'graphisme' ? (
            <div>
              {graphismeItems.length === 0 ? (
                <p className="text-center text-white/40 py-16">Aucun projet graphisme pour le moment.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {graphismeItems.map((item, i) => (
                    <GraphismeCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {webItems.length === 0 ? (
                <p className="text-center text-white/40 py-16">Aucun projet web pour le moment.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {webItems.map((item, i) => (
                    <WebCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Template>
  );
}
