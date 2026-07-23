import { Check } from 'lucide-react';

/** Bandeau garantie fin et discret, au-dessus des cartes pricing. */
export default function GuaranteeBanner() {
  return (
    <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1.5 mb-10 text-center text-xs text-white/45">
      <span className="inline-flex items-center gap-1.5">
        <Check className="w-3.5 h-3.5 text-indigo-400" />
        Paiement en 3 fois sans frais sur les packs Croissance et Signature
      </span>
      <span className="text-white/20">·</span>
      <span className="inline-flex items-center gap-1.5">
        <Check className="w-3.5 h-3.5 text-indigo-400" />
        Première publicité lancée sous 14 jours ou acompte remboursé
      </span>
    </div>
  );
}
