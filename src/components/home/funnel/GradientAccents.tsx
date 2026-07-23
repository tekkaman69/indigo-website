/**
 * Petits éléments décoratifs en dégradé indigo/violet/cyan — purement
 * esthétiques (aria-hidden). Servent à casser la monotonie du fond sombre :
 * fines lignes, halos d'angle, rebords lumineux. Aucune animation lourde,
 * uniquement des dégradés statiques discrets.
 */

/** Fine ligne horizontale dégradée, centrée — accent de rebord haut de section. */
export function GradientTopLine({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 max-w-3xl bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent ${className}`}
    />
  );
}

/** Halo lumineux diffus dans un coin — réchauffe le fond sans surcharger. */
export function GradientGlow({
  className = '',
  color = 'from-indigo-600/20 via-violet-600/10 to-transparent',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-0 rounded-full blur-3xl bg-gradient-to-br ${color} ${className}`}
    />
  );
}

/** Trait vertical fin en dégradé — accent latéral discret. */
export function GradientVerticalLine({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute w-px bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent ${className}`}
    />
  );
}
