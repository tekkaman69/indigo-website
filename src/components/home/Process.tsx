'use client';
import { motion } from 'framer-motion';
import { SectionHeader } from '../ui/SectionHeader';
import { processSteps } from '@/data/process';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const Process = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = shouldReduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      };

  return (
    <section id="process" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader title="Notre Processus, Simplifié" description="Quatre étapes claires pour un partenariat transparent et des résultats exceptionnels." />
        <motion.div
          className="relative grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {processSteps.map((step, index) => (
            <motion.div key={index} variants={itemVariants} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-card border-2 border-primary/50 mb-4">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
