'use client';

import { motion } from 'framer-motion';
import { Globe, Palette, Search, Layers, Code2, BarChart2, Target, Brush, Package, BookOpen } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { ArrowRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step {
  icon: React.ElementType;
  title: string;
  desc: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const WEB_STEPS: Step[] = [
  { icon: Search,   title: 'Analyse business',      desc: 'Objectifs, audience, positionnement concurrentiel' },
  { icon: Target,   title: 'Stratégie & structure', desc: 'Architecture, parcours utilisateur, wireframes' },
  { icon: Layers,   title: 'Design UI',              desc: 'Interface Figma validée avant développement' },
  { icon: Code2,    title: 'Développement',          desc: 'Next.js, TypeScript, optimisé Lighthouse 90+' },
  { icon: BarChart2,title: 'Optimisation',           desc: 'SEO, performance, analytics, ajustements continus' },
];

const BRAND_STEPS: Step[] = [
  { icon: Search,   title: 'Analyse positionnement', desc: 'Valeurs, ton, différenciation marché' },
  { icon: Target,   title: 'Direction artistique',   desc: 'Concept visuel, inspirations, moodboard validé' },
  { icon: Brush,    title: 'Logo & système visuel',  desc: 'Logo principal, couleurs, typographies, variantes' },
  { icon: Package,  title: 'Contenus & assets',      desc: 'Templates réseaux, supports, mockups' },
  { icon: BookOpen, title: 'Brand guidelines',        desc: 'Charte complète pour une cohérence durable' },
];

// ─── Step row ─────────────────────────────────────────────────────────────────

function StepItem({ step, index, accent }: { step: Step; index: number; accent: 'indigo' | 'violet' }) {
  const Icon = step.icon;
  const colors = {
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/25', icon: 'text-indigo-400', num: 'text-indigo-500/40' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/25', icon: 'text-violet-400', num: 'text-violet-500/40' },
  }[accent];

  return (
    <motion.div
      initial={{ opacity: 0, x: accent === 'indigo' ? -16 : 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="flex items-start gap-4 group"
    >
      <div className={`w-9 h-9 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors group-hover:border-opacity-50`}>
        <Icon className={`w-4 h-4 ${colors.icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <p className={`text-xs font-bold ${colors.num} mr-1`}>{String(index + 1).padStart(2, '0')}</p>
          <p className="text-sm font-semibold text-white">{step.title}</p>
        </div>
        <p className="text-sm text-white/40 mt-0.5 leading-relaxed">{step.desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Column ───────────────────────────────────────────────────────────────────

function Column({
  icon: Icon,
  badge,
  title,
  subtitle,
  steps,
  accent,
  borderClass,
  badgeClass,
  index,
}: {
  icon: React.ElementType;
  badge: string;
  title: string;
  subtitle: string;
  steps: Step[];
  accent: 'indigo' | 'violet';
  borderClass: string;
  badgeClass: string;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-2xl border ${borderClass} bg-white/[0.03] backdrop-blur-md p-8`}
    >
      {/* Top accent */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${accent === 'indigo' ? 'via-indigo-500/50' : 'via-violet-500/50'} to-transparent`} />

      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 ${badgeClass}`}>
        <Icon className="w-3.5 h-3.5" />
        {badge}
      </div>

      <h3 className="text-xl md:text-2xl font-bold text-white leading-snug mb-2">
        {title}
      </h3>
      <p className="text-sm text-white/40 mb-8 leading-relaxed">{subtitle}</p>

      <div className="space-y-5">
        {steps.map((step, i) => (
          <StepItem key={i} step={step} index={i} accent={accent} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function DualProcess() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="methode" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Notre approche</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Deux systèmes. Une stratégie.
          </h2>
          <p className="mt-4 text-white/50 text-lg leading-relaxed">
            Chaque canal renforcé par l'autre — pour une présence qui convertit.
          </p>
        </motion.div>

        {/* Dual columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Column
            icon={Globe}
            badge="Système digital"
            title="Un système digital qui travaille pour votre business"
            subtitle="Pas un simple site vitrine — une infrastructure de conversion pensée de bout en bout."
            steps={WEB_STEPS}
            accent="indigo"
            borderClass="border-indigo-500/15"
            badgeClass="bg-indigo-500/10 border border-indigo-500/25 text-indigo-300"
            index={0}
          />
          <Column
            icon={Palette}
            badge="Système de marque"
            title="Une image qui donne envie d'acheter avant même le contact"
            subtitle="Pas juste un logo — un système visuel cohérent qui inspire confiance et mémorisation."
            steps={BRAND_STEPS}
            accent="violet"
            borderClass="border-violet-500/15"
            badgeClass="bg-violet-500/10 border border-violet-500/25 text-violet-300"
            index={1}
          />
        </div>

        {/* Connection statement */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <div className="inline-block relative px-8 py-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md max-w-xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            <p className="text-base text-white/60 leading-relaxed">
              Ces systèmes fonctionnent indépendamment.{' '}
              <span className="text-white font-semibold">Ensemble, ils deviennent puissants.</span>
            </p>
          </div>

          <div className="mt-8">
            <GradientButton href="/contact" className="px-8 py-3">
              Obtenir un audit gratuit
              <ArrowRight className="w-4 h-4 ml-1.5 flex-shrink-0" />
            </GradientButton>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
