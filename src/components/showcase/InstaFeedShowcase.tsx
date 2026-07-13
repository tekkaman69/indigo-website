'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getInstaFeedsForDisplay } from '@/lib/firebase/firestore';
import type { InstaFeed } from '@/types/firebase';
import InstaFeedCard from './InstaFeedCard';
import { WhatsAppButton } from '@/components/home/funnel/WhatsApp';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

/**
 * Section « feeds Instagram » de la home — expose des feeds Insta réalisés
 * pour des clients sous forme de mosaïques 3×3 (format 4:5), en complément
 * de ProjectShowcase (identités graphiques). Chaque feed est une carte
 * cliquable (lightbox). Remplace l'ancienne bande auto-défilante MarqueeStrip.
 */
export default function InstaFeedShowcase() {
  const [feeds, setFeeds] = useState<InstaFeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    getInstaFeedsForDisplay()
      .then(setFeeds)
      .catch(err => console.error('Error loading insta feeds:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || feeds.length === 0) return null;

  return (
    <section id="feeds" className="w-full py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Nos feeds Instagram</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Un profil qui donne envie de vous suivre
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            9 visuels pensés comme un feed cohérent — cliquez pour les voir en grand.
          </p>
        </motion.div>

        {/* Grille de feeds — mosaïques 3×3 portrait, 2 par rangée en desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {feeds.map((feed, i) => (
            <motion.div
              key={feed.id}
              initial={reduce ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
            >
              <InstaFeedCard feed={feed} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={reduce ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <WhatsAppButton label="Je veux un feed comme ça" size="md" />
        </motion.div>
      </div>
    </section>
  );
}
