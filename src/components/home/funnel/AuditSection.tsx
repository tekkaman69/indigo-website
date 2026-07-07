'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { WhatsAppButton } from './WhatsApp';

const AUDIT_POINTS = ['20 minutes chrono', 'Par WhatsApp ou appel', 'Réponse sous 24h', 'Aucun engagement'];

export default function AuditSection() {
  const reduce = useReducedMotion();

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-md p-8 text-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 text-sm mb-5">
            <AlertCircle className="w-3.5 h-3.5" />
            Offre d'entrée — gratuit, sans engagement
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Audit visuel gratuit<br />
            <span className="text-indigo-300">en 20 minutes</span>
          </h2>
          <p className="text-white/55 mb-6 max-w-lg mx-auto leading-relaxed">
            On analyse votre image actuelle — logo, site, réseaux — et on vous donne{' '}
            <strong className="text-white/80">3 axes d'amélioration concrets</strong>. Zéro jargon.
            Zéro engagement. Juste ce dont vous avez besoin pour avancer.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-7 text-sm text-white/50">
            {AUDIT_POINTS.map(item => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-indigo-400" />
                {item}
              </span>
            ))}
          </div>
          <WhatsAppButton
            label="Je veux mon audit gratuit"
            size="lg"
            message="Bonjour, j'aimerais réserver mon audit visuel gratuit de 20 minutes."
          />
        </motion.div>
      </div>
    </section>
  );
}
