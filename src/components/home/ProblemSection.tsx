'use client';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const problems = [
  {
    stat: '3s',
    statLabel: 'pour convaincre ou perdre un prospect',
    emoji: '👁️',
    title: 'Une image qui ne reflète pas votre valeur',
    description:
      'Logo mal conçu, identité incohérente, visuels génériques — vos prospects jugent en 3 secondes et passent à la concurrence.',
    color: 'from-rose-500/15 to-transparent',
    border: 'border-rose-500/20',
    statColor: 'text-rose-400',
    accentLine: 'via-rose-500/40',
  },
  {
    stat: '0,2%',
    statLabel: "taux d'engagement moyen sans stratégie",
    emoji: '📉',
    title: "Du contenu qui ne génère pas d'engagement",
    description:
      "Vous postez sans stratégie, sans cohérence. Résultat : peu de reach, peu de confiance, et un compte qui stagne.",
    color: 'from-amber-500/15 to-transparent',
    border: 'border-amber-500/20',
    statColor: 'text-amber-400',
    accentLine: 'via-amber-500/40',
  },
  {
    stat: '70%',
    statLabel: 'des visiteurs repartent sans agir',
    emoji: '🚪',
    title: 'Un site qui ne convertit pas',
    description:
      'Lent, peu lisible, sans CTA clair — les visiteurs repartent sans avoir compris ce que vous faites ni comment vous contacter.',
    color: 'from-orange-500/15 to-transparent',
    border: 'border-orange-500/20',
    statColor: 'text-orange-400',
    accentLine: 'via-orange-500/40',
  },
];

export default function ProblemSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Le constat</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Vous perdez des clients chaque jour
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            Pas parce que votre offre est mauvaise — mais parce que votre présence digitale ne la reflète pas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className={`relative overflow-hidden rounded-xl border ${problem.border} bg-gradient-to-b ${problem.color} backdrop-blur-md p-6`}
            >
              <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent ${problem.accentLine} to-transparent`} />

              {/* Stat visuelle */}
              <div className="mb-5">
                <div className="flex items-start justify-between mb-1">
                  <span className={`text-5xl font-black tabular-nums ${problem.statColor}`}>
                    {problem.stat}
                  </span>
                  <span className="text-3xl opacity-60 mt-1">{problem.emoji}</span>
                </div>
                <p className="text-xs text-white/35 uppercase tracking-wider">{problem.statLabel}</p>
              </div>

              <div className={`h-px w-full bg-gradient-to-r from-transparent ${problem.accentLine} to-transparent mb-4`} />

              <h3 className="text-base font-semibold text-white mb-2 leading-snug">{problem.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{problem.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10 text-white/30 text-sm"
        >
          Ce n'est pas une fatalité — c'est un problème que nous résolvons.
        </motion.p>
      </div>
    </section>
  );
}
