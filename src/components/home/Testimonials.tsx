'use client';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { testimonials as staticTestimonials, type Testimonial } from '@/data/testimonials';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface FirestoreTestimonial {
  name: string;
  role?: string;
  company: string;
  quote: string;
  rating?: number;
  featured?: boolean;
  order?: number;
}

const Testimonials = () => {
  const shouldReduceMotion = useReducedMotion();
  const [items, setItems] = useState<Testimonial[]>(staticTestimonials);

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, 'testimonials'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs.map((d) => d.data() as FirestoreTestimonial);
          setItems(data);
        }
      } catch {
        // Fallback silencieux vers les données statiques
      }
    };
    load();
  }, []);

  return (
    <section id="testimonials" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Témoignages</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Ce que nos clients disent
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            Des résultats réels, des clients qui en parlent mieux que nous.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t, index) => (
            <motion.div
              key={index}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

              {/* Quote icon + étoiles */}
              <div className="flex items-start justify-between mb-4">
                <Quote className="w-7 h-7 text-indigo-500/30 flex-shrink-0" />
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Citation */}
              <p className="text-sm text-white/70 leading-relaxed italic flex-1 mb-5">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Auteur */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-white/10 flex items-center justify-center text-sm font-bold text-white/60 flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/40">
                    {t.role ? `${t.role} · ` : ''}{t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
