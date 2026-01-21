'use client';
import { Balancer } from 'react-wrap-balancer';
import { motion } from 'framer-motion';
import GradientButton from '../ui/GradientButton';
import { Button } from '../ui/button';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="container mx-auto flex min-h-[calc(100vh-80px)] items-center justify-center px-4 md:px-6 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col items-center"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter max-w-4xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
          <Balancer>
            Indigo — Création & Automatisation pour booster votre présence
          </Balancer>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          <Balancer>
            Nous créons des expériences digitales mémorables : branding, contenu social, vidéo et automatisations sur-mesure.
          </Balancer>
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <GradientButton href="/portfolio">Voir le portfolio</GradientButton>
          <Button asChild variant="ghost" className="hover:bg-white/10">
            <Link href="/contact">Parler de votre projet</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
