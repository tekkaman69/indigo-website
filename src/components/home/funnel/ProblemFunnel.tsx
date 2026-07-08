'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Target } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { WhatsAppButton } from './WhatsApp';

const OUTCOMES = [
  {
    icon: Sparkles,
    title: 'Une image qui inspire confiance dès le premier regard.',
    body: 'Logo, visuels, site : tout raconte la même histoire, celle du sérieux de votre travail. Vos prospects le voient avant même de vous parler.',
  },
  {
    icon: TrendingUp,
    title: 'Des réseaux qui transforment vos abonnés en clients.',
    body: 'Une ligne éditoriale claire et cohérente, pensée pour donner envie de vous contacter — pas juste occuper du temps.',
  },
  {
    icon: Target,
    title: 'Une pub qui génère de vraies demandes.',
    body: 'Une image crédible, une offre claire et une page de conversion : les trois ingrédients pour que chaque euro investi en Meta Ads travaille pour vous.',
  },
];

export default function ProblemFunnel() {
  const reduce = useReducedMotion();

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Ce qui change avec Indigo</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Une présence numérique qui travaille vraiment pour vous
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {OUTCOMES.map((o, i) => (
            <motion.div
              key={i}
              initial={reduce ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6"
            >
              <div className="w-11 h-11 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center mb-4">
                <o.icon className="w-5 h-5 text-indigo-300" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2 leading-snug">{o.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{o.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={reduce ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-white/40 text-sm mb-4">
            Si vous voulez ce résultat pour votre entreprise — on en parle.
          </p>
          <WhatsAppButton label="En parler sur WhatsApp" size="sm" />
        </motion.div>
      </div>
    </section>
  );
}
