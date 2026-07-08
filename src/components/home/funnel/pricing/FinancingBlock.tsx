'use client';

import { motion } from 'framer-motion';
import { Landmark, ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { waUrl } from '../WhatsApp';

const FUNDING_MESSAGE =
  "Bonjour, je souhaite vérifier mon éligibilité au Chèque TIC / Pass Numérique pour financer mon projet.";

interface FundingBlockItem {
  title: string;
  amount: string;
  conditions: string;
}

const FUNDING_ITEMS: FundingBlockItem[] = [
  {
    title: 'Guadeloupe',
    amount: 'Chèque TIC — jusqu\'à 10 000 € (80 % du projet)',
    conditions: 'Entreprise enregistrée depuis au moins 1 an, activité régulière en Guadeloupe.',
  },
  {
    title: 'Martinique',
    amount: 'Pass Numérique — jusqu\'à 10 000 € (50 % du projet)',
    conditions: 'Entreprise de plus de 3 ans, moins de 30 salariés, hors auto-entrepreneurs.',
  },
];

/** Section financement — sous les cartes pricing, avant le disclaimer légal. */
export default function FinancingBlock() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-16 max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Votre projet peut être financé jusqu'à 80 %
        </h3>
        <p className="mt-3 text-white/55 text-base">
          Guadeloupe et Martinique — nous montons le dossier avec vous.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FUNDING_ITEMS.map(item => (
          <div
            key={item.title}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <Landmark className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span className="text-sm font-semibold text-white uppercase tracking-wide">{item.title}</span>
            </div>
            <p className="text-sm text-white/80 font-medium">{item.amount}</p>
            <p className="mt-2 text-xs text-white/45 leading-relaxed">{item.conditions}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <a
          href={waUrl(FUNDING_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Vérifier mon éligibilité au financement sur WhatsApp"
          className="inline-flex items-center gap-1.5 text-sm text-indigo-300 hover:text-indigo-200 transition-colors font-medium"
        >
          Vérifier mon éligibilité — 5 min sur WhatsApp
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <p className="mt-4 text-center text-xs text-white/30 max-w-xl mx-auto leading-relaxed">
        Dispositifs sous conditions et susceptibles d'évoluer — nous confirmons l'éligibilité à
        l'ouverture du dossier.
      </p>
    </motion.div>
  );
}
