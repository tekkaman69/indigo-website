'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import GradientButton from '@/components/ui/GradientButton';
import { Button } from '@/components/ui/button';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export default function FinalCTASection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="contact-cta" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-10 md:p-16 text-center"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <p className="text-xs uppercase tracking-widest text-indigo-400 mb-4">Prêt à passer à l'action ?</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Votre projet commence maintenant
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
              Choisissez votre service, payez l'acompte et on s'occupe du reste. Ou discutons d'abord si vous voulez affiner votre besoin.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GradientButton
                href="/#services"
                className="px-8 py-3.5 text-base"
              >
                Démarrer mon projet
              </GradientButton>
              <Button
                asChild
                variant="ghost"
                className="border border-white/10 hover:bg-white/5 text-white/60 hover:text-white px-8 py-3.5 text-base"
              >
                <Link href="/contact">Discuter avant commande</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
