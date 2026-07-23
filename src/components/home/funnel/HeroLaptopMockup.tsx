'use client';

/**
 * Maquette d'ordinateur portable affichant un site web stylisé (barre de
 * navigateur + landing : nav, hero, boutons, grille) entièrement en CSS —
 * aucune image distante. Pensée pour être placée DERRIÈRE le téléphone dans
 * la composition « device stack » du hero. Purement décorative.
 */
export default function HeroLaptopMockup() {
  return (
    <div className="relative w-[420px] max-w-full" aria-hidden="true">
      {/* Écran du laptop */}
      <div className="relative rounded-t-xl border border-white/15 border-b-0 bg-[#0b0c18] p-2.5 shadow-2xl shadow-indigo-950/50">
        {/* Barre du navigateur */}
        <div className="flex items-center gap-2 px-2 pb-2">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/20" />
            <span className="w-2 h-2 rounded-full bg-white/20" />
            <span className="w-2 h-2 rounded-full bg-white/20" />
          </div>
          <div className="flex-1 h-4 rounded-full bg-white/[0.06] border border-white/10" />
        </div>

        {/* Contenu du site */}
        <div className="relative overflow-hidden rounded-md bg-[#0e0f1d]">
          {/* Nav du site */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
            <div className="h-2.5 w-14 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400" />
            <div className="flex gap-3">
              <div className="h-1.5 w-8 rounded-full bg-white/15" />
              <div className="h-1.5 w-8 rounded-full bg-white/15" />
              <div className="h-4 w-12 rounded-md bg-gradient-to-r from-indigo-500 to-violet-500" />
            </div>
          </div>

          {/* Hero du site */}
          <div className="px-5 py-6">
            <div className="space-y-2 mb-4">
              <div className="h-3.5 w-3/4 rounded-full bg-white/30" />
              <div className="h-3.5 w-1/2 rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400" />
            </div>
            <div className="space-y-1.5 mb-4">
              <div className="h-1.5 w-full rounded-full bg-white/10" />
              <div className="h-1.5 w-5/6 rounded-full bg-white/10" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-24 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500" />
              <div className="h-6 w-20 rounded-lg border border-white/15" />
            </div>
          </div>

          {/* Grille de cartes */}
          <div className="grid grid-cols-3 gap-2 px-5 pb-6">
            {[
              'from-indigo-500/70 to-violet-600/70',
              'from-cyan-400/60 to-indigo-500/70',
              'from-violet-500/70 to-fuchsia-500/60',
            ].map((grad, i) => (
              <div key={i} className={`aspect-[4/3] rounded-md bg-gradient-to-br ${grad}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Base / charnière du laptop */}
      <div className="relative mx-auto h-3 w-[112%] -ml-[6%] rounded-b-xl bg-gradient-to-b from-[#1a1b2e] to-[#0b0c18] border border-white/10 border-t-0 shadow-lg">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-16 rounded-b-md bg-white/10" />
      </div>
    </div>
  );
}
