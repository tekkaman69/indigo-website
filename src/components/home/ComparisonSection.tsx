'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Palette, Globe, Share2 } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';
import GradientButton from '@/components/ui/GradientButton';
import { ArrowRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ComparisonRow {
  label: string;
  agency: string;
  freelance: string;
  indigo: string;
}

interface ServiceComparison {
  id: string;
  icon: React.ElementType;
  label: string;
  rows: ComparisonRow[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const COMPARISONS: ServiceComparison[] = [
  {
    id: 'branding',
    icon: Palette,
    label: 'Branding',
    rows: [
      { label: 'Cible',          agency: 'Grandes entreprises',    freelance: 'Variable',               indigo: 'TPE / PME avant tout' },
      { label: 'Délai',          agency: '4 à 8 semaines',         freelance: 'Imprévisible',            indigo: '10 jours ouvrés' },
      { label: 'Ce que tu reçois', agency: 'Logo seul (souvent)',  freelance: '1 concept, peu de choix', indigo: 'Identité complète + charte' },
      { label: 'Cohérence site & contenu', agency: 'Non incluse',  freelance: 'Non incluse',             indigo: 'Intégrée dès le départ' },
      { label: 'Budget',         agency: 'Hors de portée TPE',     freelance: 'Opaque',                  indigo: 'À partir de 250€, fixe' },
    ],
  },
  {
    id: 'web',
    icon: Globe,
    label: 'Site web',
    rows: [
      { label: 'Cible',          agency: 'Budgets +5 000€',        freelance: 'Variable',                indigo: 'TPE / PME avant tout' },
      { label: 'Délai',          agency: '2 à 4 mois',             freelance: 'Imprévisible',            indigo: '3 à 4 semaines' },
      { label: 'Technologie',    agency: 'CMS lourd (WordPress…)', freelance: 'Template Wix / Squarespace', indigo: 'Next.js — rapide & solide' },
      { label: 'Performance',    agency: 'Rarement optimisé',      freelance: 'Basique',                 indigo: 'Lighthouse 90+ garanti' },
      { label: 'Alignement brand', agency: 'Séparé du branding',   freelance: 'Non inclus',              indigo: 'Cohérent avec ton identité' },
      { label: 'Budget',         agency: 'Hors de portée TPE',     freelance: 'Opaque',                  indigo: 'À partir de 500€, fixe' },
    ],
  },
  {
    id: 'contenu',
    icon: Share2,
    label: 'Contenu',
    rows: [
      { label: 'Cible',          agency: 'Grands comptes',         freelance: 'Variable',                indigo: 'TPE / PME avant tout' },
      { label: 'Stratégie',      agency: 'Process long et coûteux', freelance: 'Peu ou pas',             indigo: 'Intégrée, dès le départ' },
      { label: 'Cohérence brand', agency: 'Brief à refaire à chaque fois', freelance: 'Non garantie',   indigo: 'Alignée à ton identité' },
      { label: 'Suivi résultats', agency: 'Rapport générique',     freelance: 'Aucun',                   indigo: 'Rapport mensuel inclus' },
      { label: 'Flexibilité',    agency: 'Contrat long et rigide', freelance: 'Aléatoire',               indigo: 'Formule adaptable / mois' },
      { label: 'Budget',         agency: 'Hors de portée TPE',     freelance: 'Opaque',                  indigo: 'À partir de 190€ / mois' },
    ],
  },
];

// ─── Column header ────────────────────────────────────────────────────────────

function ColHeader({ label, sub, variant }: { label: string; sub: string; variant: 'bad' | 'neutral' | 'good' }) {
  return (
    <div className={cn(
      'text-center px-3 py-3 rounded-xl',
      variant === 'good' && 'bg-indigo-500/10 border border-indigo-500/20',
      variant === 'bad' && 'bg-white/[0.02]',
      variant === 'neutral' && 'bg-white/[0.02]',
    )}>
      <p className={cn(
        'text-sm font-bold',
        variant === 'good' ? 'text-indigo-300' : 'text-white/40',
      )}>{label}</p>
      <p className="text-[10px] text-white/25 mt-0.5">{sub}</p>
    </div>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function Row({ row, index }: { row: ComparisonRow; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-2 items-center py-3 border-b border-white/5 last:border-0"
    >
      {/* Label */}
      <p className="text-sm text-white/50 font-medium pr-2">{row.label}</p>

      {/* Agence */}
      <div className="flex items-start gap-1.5">
        <X className="w-3.5 h-3.5 text-rose-400/70 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-white/35 leading-snug">{row.agency}</p>
      </div>

      {/* Freelance */}
      <div className="flex items-start gap-1.5">
        <X className="w-3.5 h-3.5 text-white/25 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-white/30 leading-snug">{row.freelance}</p>
      </div>

      {/* Indigo */}
      <div className="flex items-start gap-1.5 bg-indigo-500/5 rounded-lg px-2 py-1.5">
        <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-white/80 font-medium leading-snug">{row.indigo}</p>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function ComparisonSection() {
  const [active, setActive] = useState<string>('branding');
  const shouldReduceMotion = useReducedMotion();
  const current = COMPARISONS.find(c => c.id === active)!;

  return (
    <section id="pourquoi" className="w-full py-20 md:py-28">
      <div className="container mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Pourquoi Indigo</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Conçu pour les TPE & PME
          </h2>
          <p className="mt-4 text-white/50 text-lg leading-relaxed">
            Les agences traditionnelles s'adressent aux grandes structures. Les freelances manquent de vision système. Indigo comble ce vide.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full bg-white/5 border border-white/10 p-1 gap-1">
            {COMPARISONS.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={cn(
                    'inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    active === c.id
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-white/45 hover:text-white/70',
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md overflow-hidden">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-2 px-5 pt-5 pb-3 border-b border-white/8">
              <div />
              <ColHeader label="Agence locale" sub="Grande structure" variant="bad" />
              <ColHeader label="Freelance" sub="Compétence unique" variant="neutral" />
              <ColHeader label="Indigo" sub="Système intégré" variant="good" />
            </div>

            {/* Rows */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-5 py-2"
              >
                {current.rows.map((row, i) => (
                  <Row key={row.label} row={row} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <GradientButton href="/contact" className="px-8 py-3">
            Démarrer mon projet
            <ArrowRight className="w-4 h-4 ml-1.5 flex-shrink-0" />
          </GradientButton>
        </motion.div>

      </div>
    </section>
  );
}
