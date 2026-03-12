'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ChevronRight, Tag, Lightbulb, Wrench, TrendingUp } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import type { PortfolioItem } from '@/types/firebase';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

const categoryToOffer: Record<string, string> = {
  branding: 'branding',
  brand: 'branding',
  identité: 'branding',
  content: 'contenu-2',
  contenu: 'contenu-2',
  réseaux: 'contenu-2',
  social: 'contenu-2',
  site: 'site-statique',
  web: 'site-statique',
  website: 'site-statique',
};

function getCheckoutOffer(category: string): string {
  const lower = category.toLowerCase();
  for (const [key, offerId] of Object.entries(categoryToOffer)) {
    if (lower.includes(key)) return offerId;
  }
  return 'branding';
}

export default function PortfolioModal({ item, onClose }: PortfolioModalProps) {
  // Fermeture avec Échap
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Lock du scroll
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [item]);

  const offer = item ? getCheckoutOffer(item.category ?? '') : 'branding';
  const coverUrl =
    item?.coverImage?.url || item?.imageUrl || '';

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Projet : ${item.title}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-gray-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermer */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image de couverture */}
            {coverUrl && (
              <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
                <Image
                  src={coverUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                  style={{ objectPosition: item.coverPosition ?? 'center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
              </div>
            )}

            {/* Contenu */}
            <div className="p-6 space-y-5">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {item.industry && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
                    <Tag className="w-3 h-3" />
                    {item.industry}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs">
                  {item.category}
                </span>
              </div>

              {/* Titre */}
              <h2 className="text-2xl font-bold text-white leading-tight">{item.title}</h2>

              {/* Contexte narratif */}
              <div className="space-y-4">
                {item.problem && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                    <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/30 mb-1">Problème</p>
                      <p className="text-sm text-white/70">{item.problem}</p>
                    </div>
                  </div>
                )}

                {item.solution && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                    <Wrench className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/30 mb-1">Solution</p>
                      <p className="text-sm text-white/70">{item.solution}</p>
                    </div>
                  </div>
                )}

                {item.result && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                    <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-green-500/50 mb-1">Résultat</p>
                      <p className="text-sm text-green-300/80 font-medium">{item.result}</p>
                    </div>
                  </div>
                )}

                {/* Fallback description si pas de champs contextuels */}
                {!item.problem && !item.solution && !item.result && item.description && (
                  <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
                )}
              </div>

              {/* CTA */}
              <div className="pt-2">
                <GradientButton
                  href={`/checkout?offer=${offer}`}
                  className="w-full py-3 text-sm justify-center"
                >
                  Obtenir la même structure
                  <ChevronRight className="w-4 h-4 ml-1" />
                </GradientButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
