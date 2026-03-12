'use client';
import { Balancer } from 'react-wrap-balancer';
import { motion } from 'framer-motion';
import GradientButton from '../ui/GradientButton';
import { Button } from '../ui/button';
import Link from 'next/link';

const Hero = () => {
  const handleScrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    /* Outer section = pleine largeur pour que le fond couvre tout l'écran */
    <section className="relative w-full flex min-h-[calc(100vh-80px)] items-center justify-center py-24 text-center overflow-hidden">

      {/* ── Fond animé grain indigo — pleine largeur ── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">

        {/* Lueurs qui respirent */}
        <div
          className="absolute rounded-full blur-[160px]"
          style={{
            width: '60vw', height: '60vh', top: '5%', left: '20%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.28) 0%, transparent 65%)',
            animation: 'heroGlow1 9s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full blur-[120px]"
          style={{
            width: '35vw', height: '55vh', top: '0%', right: '8%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 65%)',
            animation: 'heroGlow2 13s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full blur-[130px]"
          style={{
            width: '32vw', height: '45vh', bottom: '2%', left: '5%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.20) 0%, transparent 65%)',
            animation: 'heroGlow3 11s ease-in-out infinite',
          }}
        />

        {/* Grain — plein écran, mix-blend screen pour révéler les particules */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute"
          style={{
            inset: '-10%',
            width: '120%',
            height: '120%',
            opacity: 0.14,
            mixBlendMode: 'screen',
            animation: 'heroDrift 22s linear infinite',
          }}
        >
          <defs>
            <filter id="heroGrain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.55 0.55"
                numOctaves="4"
                stitchTiles="stitch"
              >
                <animate
                  attributeName="baseFrequency"
                  values="0.55 0.55;0.52 0.58;0.57 0.53;0.55 0.55"
                  dur="14s"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              {/* Luminance → alpha, teinte indigo */}
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.39
                        0 0 0 0 0.40
                        0 0 0 0 0.95
                        0.33 0.33 0.33 0 0"
              />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#heroGrain)" />
        </svg>

        <style>{`
          @keyframes heroGlow1 {
            0%,100% { transform: scale(1) translate(0,0); }
            50%     { transform: scale(1.12) translate(2%, -3%); }
          }
          @keyframes heroGlow2 {
            0%,100% { transform: translate(0,0) scale(1); }
            40%     { transform: translate(-4%, 6%) scale(1.1); }
            70%     { transform: translate(3%, -4%) scale(0.95); }
          }
          @keyframes heroGlow3 {
            0%,100% { transform: translate(0,0) scale(1); }
            50%     { transform: translate(5%, -5%) scale(1.1); }
          }
          @keyframes heroDrift {
            0%   { transform: translate(0%,  0%); }
            25%  { transform: translate(-2%, -1%); }
            50%  { transform: translate(-1%, -2%); }
            75%  { transform: translate(1%,  -1%); }
            100% { transform: translate(0%,  0%); }
          }
        `}</style>
      </div>

      {/* Contenu centré dans le container */}
      <div className="relative container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 backdrop-blur-sm"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Agence créative — Branding · Contenu · Sites
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter max-w-4xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
            <Balancer>
              Votre image de marque, votre contenu, votre site — construits pour convertir
            </Balancer>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            <Balancer>
              Nous transformons des marques invisibles en références dans leur secteur. Design, contenu et technique au service de votre croissance.
            </Balancer>
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <GradientButton
              onClick={handleScrollToServices}
              className="px-8 py-3 text-base"
            >
              Démarrer mon projet
            </GradientButton>
            <Button asChild variant="ghost" className="hover:bg-white/10 text-white/70 hover:text-white px-6 py-3">
              <Link href="/contact">Discuter avant commande</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
