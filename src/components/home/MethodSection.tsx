'use client';
import { motion } from 'framer-motion';
import { Compass, Layers, Rocket, Target, Zap, CheckCircle2 } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const pillars = [
  {
    number: '01',
    icon: Compass,
    title: 'Stratégie & Direction',
    description:
      'Chaque projet commence par comprendre votre marché, votre audience et vos objectifs. Pas de création sans cap défini.',
    accent: 'from-indigo-500 to-indigo-600',
    glow: 'bg-indigo-500/10 border-indigo-500/20',
    iconColor: 'text-indigo-400',
    glowColor: 'bg-indigo-500/5',
    badge: 'Découverte',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    checkpoints: ['Analyse de votre marché', 'Définition du positionnement', 'Brief créatif complet'],
  },
  {
    number: '02',
    icon: Layers,
    title: 'Création & Cohérence',
    description:
      'Design, contenu, code — tout est pensé pour former un système cohérent qui renforce votre image à chaque point de contact.',
    accent: 'from-violet-500 to-violet-600',
    glow: 'bg-violet-500/10 border-violet-500/20',
    iconColor: 'text-violet-400',
    glowColor: 'bg-violet-500/5',
    badge: 'Production',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    checkpoints: ['Direction artistique unifiée', 'Itérations & allers-retours', 'Validation avant livraison'],
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Livraison & Impact',
    description:
      'Nous livrons vite, avec des résultats mesurables. Délais respectés, itérations rapides, accompagnement post-livraison.',
    accent: 'from-cyan-500 to-cyan-600',
    glow: 'bg-cyan-500/10 border-cyan-500/20',
    iconColor: 'text-cyan-400',
    glowColor: 'bg-cyan-500/5',
    badge: 'Lancement',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    checkpoints: ['Mise en ligne & déploiement', 'Formation & documentation', 'Suivi post-livraison 30j'],
  },
];

export default function MethodSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">La méthode Indigo</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Trois piliers, un seul objectif
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            Vous convertir plus, vous faire reconnaître, vous faire grandir.
          </p>
        </motion.div>

        {/* Desktop: layout horizontal avec connecteurs */}
        <div className="relative">
          {/* Ligne de connexion (desktop) */}
          <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-cyan-500/30 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative flex flex-col"
              >
                {/* Numéro + icône flottant */}
                <div className="flex justify-center mb-6 relative z-10">
                  <div className={`w-[52px] h-[52px] rounded-2xl border flex items-center justify-center ${pillar.glow} shadow-lg`}>
                    <pillar.icon className={`w-6 h-6 ${pillar.iconColor}`} />
                  </div>
                </div>

                {/* Card */}
                <div className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex-1`}>
                  <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent`} />
                  {/* Glow corner */}
                  <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl ${pillar.glowColor}`} />

                  {/* Badge étape */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${pillar.badgeColor}`}>
                      <Zap className="w-3 h-3" />
                      {pillar.badge}
                    </span>
                    <span className={`text-3xl font-black bg-gradient-to-b ${pillar.accent} bg-clip-text text-transparent opacity-25`}>
                      {pillar.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{pillar.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">{pillar.description}</p>

                  {/* Checkpoints */}
                  <ul className="space-y-1.5">
                    {pillar.checkpoints.map((point, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-white/40">
                        <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${pillar.iconColor}`} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Résultat final */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-white/10" />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-white/50">
            <Target className="w-4 h-4 text-indigo-400" />
            Résultat : une présence digitale qui travaille pour vous
          </div>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-white/10" />
        </motion.div>
      </div>
    </section>
  );
}
