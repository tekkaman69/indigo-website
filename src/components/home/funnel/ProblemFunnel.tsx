'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { WhatsAppButton } from './WhatsApp';

const PROBLEMS = [
  {
    icon: '🪞',
    title: 'Votre image ne reflète pas la qualité de votre travail.',
    body: "Vous faites un excellent boulot. Mais votre logo, vos visuels ou votre site ne le montrent pas — et vos prospects partent chez quelqu'un qui semble plus « sérieux ».",
  },
  {
    icon: '📱',
    title: "Vous postez sur les réseaux, mais ça n'apporte pas de clients.",
    body: "Likes, abonnés… mais peu de vrais contacts. Le contenu sans stratégie ni cohérence visuelle ne convertit pas — il occupe juste du temps.",
  },
  {
    icon: '🎯',
    title: "Vous aimeriez lancer de la pub, mais vous ne savez pas par où commencer.",
    body: "Meta Ads peut amener des demandes — à condition d'avoir une image crédible, une offre claire et une page de conversion. Sans ça, le budget pub se dilue.",
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
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Vous reconnaissez-vous ?</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ce que vivent la plupart des TPE/PME aux Antilles
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROBLEMS.map((p, i) => (
            <motion.div
              key={i}
              initial={reduce ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6"
            >
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="text-base font-semibold text-white mb-2 leading-snug">{p.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{p.body}</p>
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
            Si vous vous reconnaissez dans l'une de ces situations — on peut changer ça.
          </p>
          <WhatsAppButton label="En parler sur WhatsApp" size="sm" />
        </motion.div>
      </div>
    </section>
  );
}
