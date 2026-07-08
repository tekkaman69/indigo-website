/**
 * Placeholder visuel pour les médias projet non encore fournis.
 * SVG pur (aucun fichier image), dégradé seedé de façon déterministe à
 * partir d'une string — même seed = même rendu, pas de flash au re-render.
 * Palette alignée sur le gradient de marque (indigo/violet/cyan).
 */

interface PlaceholderMeshProps {
  seed: string;
  className?: string;
  label?: string;
}

/** Hash simple et stable pour dériver des angles/positions à partir du seed. */
function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const PALETTE = [
  ['#4F46E5', '#7C3AED'], // indigo → violet
  ['#7C3AED', '#22D3EE'], // violet → cyan
  ['#22D3EE', '#4F46E5'], // cyan → indigo
];

export default function PlaceholderMesh({ seed, className = '', label }: PlaceholderMeshProps) {
  const hash = hashSeed(seed);
  const [c1, c2] = PALETTE[hash % PALETTE.length];
  const cx1 = 20 + (hash % 40);
  const cy1 = 15 + ((hash >> 3) % 40);
  const cx2 = 60 + ((hash >> 5) % 30);
  const cy2 = 55 + ((hash >> 7) % 35);
  const gradId = `mesh-${hash}`;

  return (
    <div className={`relative overflow-hidden bg-[#0b0c1a] ${className}`} aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`${gradId}-a`} cx={`${cx1}%`} cy={`${cy1}%`} r="70%">
            <stop offset="0%" stopColor={c1} stopOpacity="0.55" />
            <stop offset="100%" stopColor={c1} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${gradId}-b`} cx={`${cx2}%`} cy={`${cy2}%`} r="65%">
            <stop offset="0%" stopColor={c2} stopOpacity="0.45" />
            <stop offset="100%" stopColor={c2} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="#0b0c1a" />
        <rect width="100" height="100" fill={`url(#${gradId}-a)`} />
        <rect width="100" height="100" fill={`url(#${gradId}-b)`} />
      </svg>
      {label && (
        <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-widest text-white/30">
          {label}
        </span>
      )}
    </div>
  );
}
