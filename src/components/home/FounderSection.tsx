'use client';

import Image from 'next/image';
import Balancer from 'react-wrap-balancer';
import { motion } from 'framer-motion';
import GradientButton from '../ui/GradientButton';
import Link from 'next/link';
import { Button } from '../ui/button';

const FounderPortrait = ({ src }: { src?: string }) => {
  return (
    <div className="relative w-56 h-56 md:w-72 md:h-72 mx-auto">
      {/* Spinning Particles */}
      <div className="absolute inset-[-40px] particles-container">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--primary)/0.1)_0%,_transparent_50%,_transparent_100%)]"
          style={{
            maskImage: `
              radial-gradient(circle at 10% 10%, black 2px, transparent 0),
              radial-gradient(circle at 80% 20%, black 3px, transparent 0),
              radial-gradient(circle at 90% 80%, black 2px, transparent 0),
              radial-gradient(circle at 25% 95%, black 3px, transparent 0),
              radial-gradient(circle at 50% 50%, black 1px, transparent 0)
            `,
          }}
        />
      </div>

      {/* Outer Glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-primary via-accent to-cyan-400 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
      
      {/* Medallion */}
      <div className="relative w-full h-full rounded-full border border-white/10 bg-background/50 backdrop-blur-sm overflow-hidden p-1 shadow-2xl shadow-primary/10">
        {src ? (
          <Image
            src={src}
            alt="Portrait de Valentin Jean-Baptiste"
            fill
            className="rounded-full object-cover object-[50%_35%]"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-card to-background flex items-center justify-center">
            {/* Placeholder as an elegant silhouette/gradient */}
            <div className="w-2/3 h-2/3 rounded-full bg-gradient-to-br from-primary/20 via-accent/20 to-cyan-400/20 opacity-50 blur-lg" />
          </div>
        )}
      </div>
    </div>
  );
};


const FounderSection = () => {
  return (
    <motion.section
      id="founder"
      className="w-full py-16 md:py-24"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="md:order-2 flex justify-center">
             <FounderPortrait src="https://i.imgur.com/o884Fl0.jpg" />
          </div>
          <div className="md:order-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                <Balancer>Valentin Jean-Baptiste</Balancer>
            </h2>
            <p className="mt-2 text-lg font-medium text-primary">
                Fondateur d’Indigo — Directeur artistique
            </p>
            <p className="mt-6 text-muted-foreground max-w-xl mx-auto md:mx-0">
              <Balancer>
                Créatif dans l'âme et passionné par les nouvelles technologies, j'ai fondé Indigo avec une mission claire : utiliser l'intelligence artificielle pour rendre la création de haute qualité plus accessible, sans jamais compromettre l'exigence artistique. Pour moi, l'IA n'est pas un remplacement, mais un levier. C'est l'association de l'humain et de la machine qui donne naissance aux workflows les plus puissants, combinant direction artistique, cohérence et efficacité. Notre but est de décupler la créativité, pas de la remplacer.
              </Balancer>
            </p>
             <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <GradientButton href="/portfolio">Découvrir le portfolio</GradientButton>
                <Button asChild variant="ghost" className="hover:bg-white/10">
                    <Link href="/contact">Me contacter</Link>
                </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FounderSection;
