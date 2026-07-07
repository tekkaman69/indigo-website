'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { getMosaicItems } from '@/lib/firebase/firestore';
import type { MosaicItem } from '@/types/firebase';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { WhatsAppButton } from './WhatsApp';

// ─── Tuile ────────────────────────────────────────────────────────────────────

function MosaicTile({ item, index, reduce }: { item: MosaicItem; index: number; reduce: boolean }) {
  const img = (
    <Image
      src={item.url}
      alt={item.alt}
      width={600}
      height={800}
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      quality={82}
      className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
    />
  );

  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="mb-4 break-inside-avoid"
    >
      {item.projectId ? (
        // Image liée à un projet → cliquable, overlay avec CTA
        <Link
          href={`/portfolio/${item.projectId}`}
          className="group relative block w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label={item.projectTitle ? `Voir le projet : ${item.projectTitle}` : 'Voir le projet'}
        >
          {img}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                {item.industry && (
                  <p className="text-[11px] uppercase tracking-widest text-indigo-300/90 mb-0.5">{item.industry}</p>
                )}
                {item.projectTitle && (
                  <p className="text-sm font-semibold text-white truncate">{item.projectTitle}</p>
                )}
              </div>
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-indigo-200" />
              </span>
            </div>
          </div>
        </Link>
      ) : (
        // Image décorative non liée → simple zoom au hover, pas de CTA
        <div className="group relative block w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
          {img}
        </div>
      )}
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function WorkMosaic() {
  const [items, setItems] = useState<MosaicItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    getMosaicItems()
      .then(setItems)
      .catch(err => console.error('Error loading mosaic:', err))
      .finally(() => setIsLoading(false));
  }, []);

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
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Nos réalisations</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Une image qui donne envie de vous faire confiance
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            Identités visuelles, contenus, sites — des entreprises antillaises dont l'image a changé.
          </p>
        </motion.div>

        {/* Mosaïque masonry */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {items.map((item, i) => (
            <MosaicTile key={item.id} item={item} index={i} reduce={reduce} />
          ))}
        </div>

        <motion.div
          initial={reduce ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-200 text-sm font-medium transition-colors"
          >
            Voir tout le portfolio
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <WhatsAppButton label="Je veux un résultat comme ça" size="md" />
        </motion.div>
      </div>
    </section>
  );
}
