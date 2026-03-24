'use client';

import { useRef } from 'react';
import { Balancer } from 'react-wrap-balancer';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import GradientButton from '../ui/GradientButton';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';

// ─── Floating Preview Cards ──────────────────────────────────────────────────

function BrandCard() {
  return (
    <div className="w-[250px] rounded-2xl border border-white/10 bg-gray-950/90 backdrop-blur-xl p-6 shadow-2xl shadow-black/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
          <span className="text-white font-black text-sm tracking-tight">IN</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-white leading-none">Brand System</p>
          <p className="text-[10px] text-white/40 mt-0.5">Identity · 2025</p>
        </div>
      </div>
      <div className="flex gap-1.5 mb-4">
        {['#4F46E5','#7C3AED','#2563EB','#1E1B4B','#E2E8F0'].map((c, i) => (
          <div key={i} style={{ background: c }} className="w-6 h-6 rounded-full border border-white/10" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-indigo-500/20 border border-indigo-500/30 flex-shrink-0" />
          <div className="h-1.5 flex-1 bg-white/15 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-violet-500/20 border border-violet-500/30 flex-shrink-0" />
          <div className="h-1.5 w-2/3 bg-white/10 rounded-full" />
        </div>
      </div>
      <p className="text-[10px] text-white/20 mt-4 uppercase tracking-widest">Visual System</p>
    </div>
  );
}

function WebCard() {
  return (
    <div className="w-[290px] rounded-2xl border border-white/10 bg-gray-950/90 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/50">
      <div className="h-7 bg-white/5 border-b border-white/8 flex items-center px-3 gap-1.5">
        <div className="w-2 h-2 rounded-full bg-rose-400/50" />
        <div className="w-2 h-2 rounded-full bg-yellow-400/50" />
        <div className="w-2 h-2 rounded-full bg-green-400/50" />
        <div className="ml-2 flex-1 h-3 rounded bg-white/8 flex items-center px-2 gap-1">
          <div className="w-2 h-1 bg-white/20 rounded-full" />
          <div className="flex-1 h-1 bg-white/10 rounded-full" />
        </div>
      </div>
      <div className="p-4">
        <div className="h-1.5 w-14 bg-indigo-400/60 rounded-full mb-2" />
        <div className="h-3.5 w-36 bg-white/35 rounded mb-1.5" />
        <div className="h-2 w-28 bg-white/18 rounded mb-1" />
        <div className="h-2 w-22 bg-white/12 rounded mb-4" />
        <div className="flex gap-2 mb-4">
          <div className="h-7 w-20 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600" />
          <div className="h-7 w-16 rounded-full border border-white/15 bg-white/5" />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[1,2,3].map(i => (
            <div key={i} className="h-10 rounded-lg bg-white/5 border border-white/8" />
          ))}
        </div>
      </div>
      <p className="text-[10px] text-white/20 px-4 pb-3 uppercase tracking-widest">Web · Live site</p>
    </div>
  );
}

function SocialCard() {
  return (
    <div className="w-[190px] h-[190px] rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/70 via-indigo-800/50 to-gray-950" />
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-indigo-500/60 border border-indigo-400/40" />
          <div className="h-1.5 w-14 bg-white/30 rounded-full" />
        </div>
        <div>
          <div className="h-2 w-20 bg-white/60 rounded-full mb-1.5" />
          <div className="h-1.5 w-24 bg-white/30 rounded-full mb-1" />
          <div className="h-1.5 w-16 bg-white/20 rounded-full mb-3" />
          <div className="flex gap-2">
            <div className="h-2 w-5 bg-white/25 rounded-full" />
            <div className="h-2 w-5 bg-white/25 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashCard() {
  const bars = [30, 48, 42, 65, 55, 78, 70, 88];
  return (
    <div className="w-[265px] rounded-2xl border border-white/10 bg-gray-950/90 backdrop-blur-xl p-6 shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">Growth</p>
          <p className="text-2xl font-bold text-white leading-none">+47%</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
        </div>
      </div>
      <div className="flex items-end gap-1 h-10 mb-2">
        {bars.map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className={`flex-1 rounded-sm ${i === bars.length - 1 ? 'bg-indigo-500' : 'bg-indigo-500/30'}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-white/20 mb-3">
        <span>Jan</span><span>Août</span>
      </div>
      <div className="h-px bg-white/8 mb-3" />
      <div className="flex gap-4">
        <div>
          <p className="text-[10px] text-white/30">Portée</p>
          <p className="text-xs font-semibold text-white/70">12.4k</p>
        </div>
        <div>
          <p className="text-[10px] text-white/30">Conversion</p>
          <p className="text-xs font-semibold text-indigo-300">8.2%</p>
        </div>
      </div>
    </div>
  );
}

// ─── Float animation speeds ───────────────────────────────────────────────────

const floatVariants = (duration: number, yRange: number, rotRange: number) => ({
  animate: {
    y: [0, -yRange, 0],
    rotate: [-rotRange, rotRange, -rotRange],
    transition: { duration, repeat: Infinity, ease: 'easeInOut' as const },
  },
});

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  // Spring smoothing — stiffness basse = mouvement lent et fluide, sans tremblements
  const mouseX = useSpring(rawX, { stiffness: 40, damping: 25, mass: 1 });
  const mouseY = useSpring(rawY, { stiffness: 40, damping: 25, mass: 1 });

  const p1x = useTransform(mouseX, [-1, 1], [-10, 10]);
  const p1y = useTransform(mouseY, [-1, 1], [-10, 10]);
  const p2x = useTransform(mouseX, [-1, 1], [8, -8]);
  const p2y = useTransform(mouseY, [-1, 1], [6, -6]);
  const p3x = useTransform(mouseX, [-1, 1], [-6, 6]);
  const p3y = useTransform(mouseY, [-1, 1], [10, -10]);
  const p4x = useTransform(mouseX, [-1, 1], [12, -12]);
  const p4y = useTransform(mouseY, [-1, 1], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full flex min-h-[calc(100vh-80px)] items-center overflow-hidden"
    >
      {/* ── Fond grain indigo ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute rounded-full blur-[160px]" style={{ width: '55vw', height: '65vh', top: '0%', left: '15%', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 65%)', animation: 'heroGlow1 9s ease-in-out infinite' }} />
        <div className="absolute rounded-full blur-[120px]" style={{ width: '35vw', height: '55vh', top: '0%', right: '5%', background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 65%)', animation: 'heroGlow2 13s ease-in-out infinite' }} />
        <div className="absolute rounded-full blur-[130px]" style={{ width: '30vw', height: '40vh', bottom: '0%', left: '5%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)', animation: 'heroGlow3 11s ease-in-out infinite' }} />
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute" style={{ inset: '-10%', width: '120%', height: '120%', opacity: 0.13, mixBlendMode: 'screen', animation: 'heroDrift 22s linear infinite' }}>
          <defs>
            <filter id="heroGrain">
              <feTurbulence type="fractalNoise" baseFrequency="0.55 0.55" numOctaves="4" stitchTiles="stitch">
                <animate attributeName="baseFrequency" values="0.55 0.55;0.52 0.58;0.57 0.53;0.55 0.55" dur="14s" repeatCount="indefinite" />
              </feTurbulence>
              <feColorMatrix type="matrix" values="0 0 0 0 0.39  0 0 0 0 0.40  0 0 0 0 0.95  0.33 0.33 0.33 0 0" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#heroGrain)" />
        </svg>
        <style>{`
          @keyframes heroGlow1 { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.12) translate(2%,-3%)} }
          @keyframes heroGlow2 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-4%,6%) scale(1.1)} 70%{transform:translate(3%,-4%) scale(0.95)} }
          @keyframes heroGlow3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(5%,-5%) scale(1.1)} }
          @keyframes heroDrift { 0%{transform:translate(0%,0%)} 25%{transform:translate(-2%,-1%)} 50%{transform:translate(-1%,-2%)} 75%{transform:translate(1%,-1%)} 100%{transform:translate(0%,0%)} }
        `}</style>
      </div>

      {/* ── Content ── */}
      <div className="relative container mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* LEFT — Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
              Agence de systèmes digitaux
            </motion.div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              <Balancer>
                Votre marque, votre site, votre contenu —{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  construits pour croître
                </span>
              </Balancer>
            </h1>

            <p className="text-lg text-white/55 leading-relaxed mb-8 max-w-lg">
              Nous construisons des systèmes digitaux complets : identité visuelle, site web, contenu — chaque pièce renforce les autres.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <GradientButton href="/contact" className="px-7 py-3 text-base">
                Obtenir un audit gratuit
                <ArrowRight className="w-4 h-4 ml-1.5 flex-shrink-0" />
              </GradientButton>
              <Button asChild variant="ghost" className="hover:bg-white/8 text-white/60 hover:text-white px-6 py-3">
                <Link href="#services">Voir les offres</Link>
              </Button>
            </div>

            {/* Social proof strip */}
            <div className="mt-10 flex items-center gap-6 text-sm text-white/35">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['#4F46E5','#7C3AED','#2563EB'].map((c, i) => (
                    <div key={i} style={{ background: c }} className="w-7 h-7 rounded-full border-2 border-gray-950" />
                  ))}
                </div>
                <span>12+ clients actifs</span>
              </div>
              <div className="w-px h-4 bg-white/15" />
              <span>Livraison en 10j</span>
              <div className="w-px h-4 bg-white/15" />
              <span>Résultats mesurables</span>
            </div>
          </motion.div>

          {/* RIGHT — Floating cards */}
          <div className="relative h-[500px] hidden lg:block">

            {/* Card 1: Brand System — top left */}
            <motion.div
              className="absolute"
              style={{ top: 0, left: '5%', x: p1x, y: p1y }}
              {...floatVariants(7, 14, 1.5)}
            >
              <BrandCard />
            </motion.div>

            {/* Card 2: Web Design — top right */}
            <motion.div
              className="absolute"
              style={{ top: '10%', right: 0, x: p2x, y: p2y }}
              {...floatVariants(9, 18, 1)}
            >
              <WebCard />
            </motion.div>

            {/* Card 3: Social Content — bottom left */}
            <motion.div
              className="absolute"
              style={{ bottom: '5%', left: '8%', x: p3x, y: p3y }}
              {...floatVariants(6, 12, 2)}
            >
              <SocialCard />
            </motion.div>

            {/* Card 4: Dashboard — bottom right */}
            <motion.div
              className="absolute"
              style={{ bottom: 0, right: '2%', x: p4x, y: p4y }}
              {...floatVariants(11, 10, 0.8)}
            >
              <DashCard />
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
