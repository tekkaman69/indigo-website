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
            Prêt à attirer plus de clients<br />avec une présence qui inspire confiance ?
          </h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            Un audit gratuit. 20 minutes. Trois recommandations concrètes.<br />
            On vous répond sous 24h.
          </p>
          <WhatsAppButton
            label="Démarrer mon audit gratuit maintenant"
            size="lg"
            message="Bonjour, je souhaite démarrer mon audit gratuit. Pouvez-vous me recontacter ?"
          />
          <p className="mt-4 text-sm text-white/25">Indigo · Martinique & Guadeloupe</p>
        </motion.div>
      </div>
    </section>
  );
}
