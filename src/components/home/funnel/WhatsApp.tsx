'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

// ─── Config WhatsApp ──────────────────────────────────────────────────────────

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '596XXXXXXXXX';

/** Construit une URL wa.me avec message pré-rempli encodé. */
export function waUrl(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

const DEFAULT_MESSAGE =
  "Bonjour, j'ai vu votre site et j'aimerais en savoir plus sur l'audit gratuit.";

type Size = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-5 py-2.5 text-sm gap-2',
  md: 'px-7 py-3.5 text-base gap-2.5',
  lg: 'px-8 py-4 text-lg gap-3',
};

interface WhatsAppButtonProps {
  label?: string;
  size?: Size;
  /** Message pré-rempli ; sinon message d'audit par défaut. */
  message?: string;
}

export function WhatsAppButton({
  label = 'Prendre rendez-vous sur WhatsApp',
  size = 'md',
  message = DEFAULT_MESSAGE,
}: WhatsAppButtonProps) {
  return (
    <a
      href={waUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center font-semibold rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-950 ${SIZE_CLASSES[size]}`}
    >
      <MessageCircle className="w-5 h-5 flex-shrink-0" />
      {label}
    </a>
  );
}

/** Bouton flottant persistant — visible sur tout le scroll du funnel. */
export function WhatsAppFAB() {
  return (
    <a
      href={waUrl(DEFAULT_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] flex items-center justify-center shadow-xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-950"
      aria-label="Nous contacter sur WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 border-2 border-gray-950 animate-pulse" />
    </a>
  );
}

/**
 * Séparateur fin entre sections du funnel.
 * Au passage dans le viewport, un éclat indigo balaye la ligne (une seule fois),
 * guidant l'œil vers la section suivante.
 */
export function FunnelDivider() {
  const reduce = useReducedMotion();

  return (
    <div className="relative w-full h-px">
      {/* Ligne de base */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Éclat au passage */}
      {!reduce && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0.3 }}
          whileInView={{ opacity: [0, 1, 0.35], scaleX: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent"
        />
      )}
    </div>
  );
}
