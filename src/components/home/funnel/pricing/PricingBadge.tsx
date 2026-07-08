interface PricingBadgeProps {
  variant: 'most-chosen' | 'fundable';
  className?: string;
}

const VARIANT_CLASSES: Record<PricingBadgeProps['variant'], string> = {
  'most-chosen': 'bg-indigo-500/20 border-indigo-500/30 text-indigo-200',
  fundable: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200',
};

const VARIANT_LABEL: Record<PricingBadgeProps['variant'], string> = {
  'most-chosen': 'Le plus choisi',
  fundable: 'Subventionnable jusqu\'à 80 %',
};

/** Badge de mise en avant d'un pack — variants indigo (populaire) et émeraude (subventionnable). */
export default function PricingBadge({ variant, className = '' }: PricingBadgeProps) {
  return (
    <span
      role="status"
      className={`inline-flex items-center px-3 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {VARIANT_LABEL[variant]}
    </span>
  );
}
