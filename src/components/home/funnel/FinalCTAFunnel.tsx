'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { WhatsAppButton } from './WhatsApp';

export default function FinalCTAFunnel() {
  const reduce = useReducedMotion();

  return (
    <section className="w-full py-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à donner à votre entreprise<br />l'image qu'elle mérite ?
          </h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            20 minutes au téléphone, gratuit. Je regarde votre situation et je vous
            donne 3 conseils concrets.<br />
            Je vous réponds sous 24h.
          </p>
          <WhatsAppButton
            label="Réserver mon appel gratuit"
            size="lg"
            message="Bonjour, je souhaite réserver mon appel gratuit. Pouvez-vous me recontacter ?"
          />
          <p className="mt-4 text-sm text-white/25">Indigo · designer français, à votre service</p>
        </motion.div>
      </div>
    </section>
  );
}
