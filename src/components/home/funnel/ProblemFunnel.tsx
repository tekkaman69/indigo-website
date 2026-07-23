'use client';

import { motion } from 'framer-motion';
import { Layers, Hourglass, HelpCircle } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { WhatsAppButton } from './WhatsApp';
import { GradientGlow } from './GradientAccents';

// Section "Intérêt" (AIDA) : on nomme la douleur réelle avant de vendre.
// La frustration n°1 des clients : ils sont perdus, donc ils ne font rien.
const PAINS = [
  {
    icon: Layers,
    title: 'Instagram, site, Google, pub…',
    body: 'On vous dit qu\'il faut être partout. Résultat : vous ouvrez dix onglets, vous ne savez pas lequel compte vraiment, et vous refermez tout.',
  },
  {
    icon: Hourglass,
    title: 'Vous n\'avez pas le temps pour ça.',
    body: 'Vous gérez déjà votre métier du matin au soir. Passer vos soirées à bricoler un logo ou une pub, ce n\'est pas votre travail — et ça se voit.',
  },
  {
    icon: HelpCircle,
    title: 'Vous avez peur de payer pour rien.',
    body: 'Un cousin qui « fait du design », une pub lancée au hasard… Vous avez peut-être déjà dépensé sans rien voir venir. Normal de se méfier.',
  },
];

export default function ProblemFunnel() {
  const reduce = useReducedMotion();

  return (
    <section className="relative w-full py-20 px-4 overflow-hidden">
      {/* Halo diffus décalé — réchauffe le fond sombre sans distraire */}
      <GradientGlow className="top-1/4 -right-20 w-[400px] h-[400px]" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Si vous vous reconnaissez là-dedans…</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Vous faites du bon travail. Mais en ligne, ça ne se voit pas.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PAINS.map((o, i) => (
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

        {/* Bascule douleur → solution : le soulagement, en une phrase forte. */}
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center max-w-2xl mx-auto"
        >
          <p className="text-xl md:text-2xl font-semibold text-white leading-snug">
            La bonne nouvelle ? Vous n'avez rien à gérer.
          </p>
          <p className="mt-3 text-white/55 leading-relaxed">
            Vous me parlez de votre métier une fois. Je m'occupe de tout le reste —
            votre logo, vos réseaux, votre page, vos publicités — et je vous livre
            quelque chose de prêt à l'emploi. Vous, vous gardez vos soirées.
          </p>
          <div className="mt-6">
            <WhatsAppButton label="En parler sur WhatsApp" size="sm" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
