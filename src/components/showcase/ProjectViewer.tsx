'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, animate } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '@/types/showcase';
import PlaceholderMesh from './PlaceholderMesh';
import BeforeAfterSlider from './BeforeAfterSlider';
import { WhatsAppButton } from '@/components/home/funnel/WhatsApp';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';

const SCREEN_COUNT = 5;

interface ProjectViewerProps {
  project: Project | null;
  onClose: () => void;
}

// ─── Écran 5 : compteur animé ─────────────────────────────────────────────────

function MetricCounter({ value, reduce }: { value: string; reduce: boolean }) {
  const numeric = parseInt(value.replace(/\D/g, ''), 10) || 0;
  const suffix = value.replace(/[\d]/g, '');
  const mv = useMotionValue(reduce ? numeric : 0);
  const [display, setDisplay] = useState(reduce ? numeric : 0);

  useEffect(() => {
    if (reduce) {
      setDisplay(numeric);
      return;
    }
    const controls = animate(mv, numeric, {
      duration: 1.1,
      ease: 'easeOut',
      onUpdate: v => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [numeric, reduce, mv]);

  return (
    <span className="text-6xl md:text-7xl font-bold tabular-nums text-white">
      {display}
      {suffix}
    </span>
  );
}

// ─── Média avec lazy-load conditionnel (écran courant + suivant) ─────────────

function ScreenMedia({
  media,
  seed,
  shouldLoad,
  className = '',
}: {
  media: { kind: 'image' | 'video'; src: string; alt: string; poster?: string };
  seed: string;
  shouldLoad: boolean;
  className?: string;
}) {
  if (!shouldLoad) return <div className={`bg-[#0b0c1a] ${className}`} />;
  if (!media.src) return <PlaceholderMesh seed={seed} className={className} />;
  if (media.kind === 'video') {
    return (
      <video
        className={`object-cover ${className}`}
        autoPlay
        muted
        loop
        playsInline
        poster={media.poster}
        src={media.src}
      />
    );
  }
  return (
    <div className={`relative ${className}`}>
      <Image src={media.src} alt={media.alt} fill sizes="100vw" className="object-cover" />
    </div>
  );
}

export default function ProjectViewer({ project, onClose }: ProjectViewerProps) {
  const [screen, setScreen] = useState(0);
  const reduce = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(project !== null);

  // Reset à l'ouverture d'un nouveau projet
  useEffect(() => {
    if (project) setScreen(0);
  }, [project]);

  // Focus initial + piège de focus + Escape
  useEffect(() => {
    if (!project) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowRight') setScreen(s => Math.min(s + 1, SCREEN_COUNT - 1));
      if (e.key === 'ArrowLeft') setScreen(s => Math.max(s - 1, 0));
      if (e.key === 'Tab') {
        const focusable = containerRef.current?.querySelectorAll<HTMLElement>(
          'button, a[href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const next = () => setScreen(s => Math.min(s + 1, SCREEN_COUNT - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));

  const handleDragEnd = (_: unknown, info: { offset: { x: number; y: number } }) => {
    const { x, y } = info.offset;
    if (Math.abs(y) > Math.abs(x) && y > 100) {
      onClose();
      return;
    }
    if (x < -80) next();
    else if (x > 80) prev();
  };

  const waMessage = `Bonjour, j'ai vu le projet ${project.client} et j'aimerais un résultat comme ça.`;

  return (
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Détail du projet ${project.client}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[60] bg-[#050509] text-white overflow-hidden"
    >
      {/* Barres de progression */}
      <div className="absolute top-0 inset-x-0 z-20 flex gap-1.5 p-4 pt-[max(1rem,env(safe-area-inset-top))]">
        {Array.from({ length: SCREEN_COUNT }).map((_, i) => (
          <div key={i} className="h-0.5 flex-1 rounded-full bg-white/20 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                i < screen ? 'w-full bg-white' : i === screen ? 'w-full bg-white/60' : 'w-0 bg-white'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Fermer */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute top-6 right-4 z-20 w-10 h-10 rounded-full bg-black/40 border border-white/15 flex items-center justify-center hover:bg-black/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Flèches desktop */}
      {screen > 0 && (
        <button
          type="button"
          onClick={prev}
          aria-label="Écran précédent"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 border border-white/15 items-center justify-center hover:bg-black/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {screen < SCREEN_COUNT - 1 && (
        <button
          type="button"
          onClick={next}
          aria-label="Écran suivant"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 border border-white/15 items-center justify-center hover:bg-black/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Zones de tap invisibles (fallback tactile en reduced-motion, où le drag est désactivé) */}
      {reduce && (
        <>
          <button aria-label="Écran précédent" onClick={prev} className="md:hidden absolute inset-y-0 left-0 w-1/3 z-10" />
          <button aria-label="Écran suivant" onClick={next} className="md:hidden absolute inset-y-0 right-0 w-1/3 z-10" />
        </>
      )}

      {/* Contenu */}
      <motion.div
        drag={reduce ? false : true}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        className="relative h-full w-full"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: reduce ? 0.15 : 0.3 }}
            className="h-full w-full flex flex-col items-center justify-center overflow-y-auto px-4 sm:px-6 pt-20 pb-10"
          >
            {/* Écran 1 — Cover */}
            {screen === 0 && (
              <motion.div
                layoutId={`project-cover-${project.slug}`}
                className="relative w-full max-w-md aspect-[4/5] max-h-[65svh] rounded-2xl overflow-hidden"
              >
                <ScreenMedia media={project.cover} seed={project.slug} shouldLoad className="absolute inset-0 h-full w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-xs uppercase tracking-widest text-cyan-300/80 mb-1">{project.sector}</p>
                  <h3 className="text-2xl font-bold text-white">{project.client}</h3>
                </div>
              </motion.div>
            )}

            {/* Écran 2 — Avant/Après */}
            {screen === 1 && (
              <div className="w-full max-w-md max-h-[65svh]">
                {project.before && project.after ? (
                  <BeforeAfterSlider before={project.before} after={project.after} seed={project.slug} />
                ) : (
                  <div className="relative aspect-[4/5] max-h-[65svh] w-full rounded-2xl overflow-hidden mx-auto">
                    <ScreenMedia
                      media={project.gallery[0] ?? project.cover}
                      seed={`${project.slug}-fallback`}
                      shouldLoad
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Écran 3 — Le problème */}
            {screen === 2 && (
              <div className="w-full max-w-lg text-center">
                <p className="text-xs uppercase tracking-widest text-indigo-400 mb-6">Le problème</p>
                <p className="text-2xl md:text-3xl font-semibold text-white leading-snug">
                  {project.problem}
                </p>
              </div>
            )}

            {/* Écran 4 — Ce qu'on a fait */}
            {screen === 3 && (
              <div className="w-full max-w-md">
                <p className="text-xs uppercase tracking-widest text-indigo-400 mb-5 text-center">Ce qu'on a fait</p>
                <div className="space-y-4">
                  {project.delivered.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <ScreenMedia
                          media={item.media}
                          seed={`${project.slug}-delivered-${i}`}
                          shouldLoad={screen === 3}
                          className="absolute inset-0 h-full w-full"
                        />
                      </div>
                      <p className="text-sm text-white/80">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Écran 5 — Le résultat */}
            {screen === 4 && (
              <div className="w-full max-w-md text-center">
                <p className="text-xs uppercase tracking-widest text-indigo-400 mb-6">Le résultat</p>
                {project.result?.kind === 'metric' ? (
                  <div className="mb-8">
                    <MetricCounter value={project.result.value} reduce={reduce} />
                    <p className="mt-2 text-white/60">{project.result.label}</p>
                  </div>
                ) : project.result?.kind === 'testimonial' ? (
                  <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="text-white/80 italic leading-relaxed mb-4">« {project.result.quote} »</p>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{project.result.author[0]}</span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-white">{project.result.author}</p>
                        <p className="text-xs text-white/40">{project.result.role}</p>
                      </div>
                    </div>
                  </div>
                ) : project.result?.kind === 'text' ? (
                  <p className="text-2xl md:text-3xl font-semibold text-white leading-snug mb-8">
                    {project.result.label}
                  </p>
                ) : null}
                <WhatsAppButton label="Je veux un résultat comme ça" size="lg" message={waMessage} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
