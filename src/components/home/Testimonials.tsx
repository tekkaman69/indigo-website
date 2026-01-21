'use client';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { SectionHeader } from '../ui/SectionHeader';
import { testimonials } from '@/data/testimonials';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const Testimonials = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
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
    <section id="testimonials" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader title="Ce que nos clients disent" description="La confiance est notre plus grande récompense. Voici quelques-uns de leurs retours." />
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-foreground/90 italic">"{testimonial.quote}"</p>
                </div>
                <div className="mt-6">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
