'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const TESTIMONIALS = [
  {
    name: 'Emmanuel D.',
    role: 'CEO',
    company: 'Suteki',
    quote: "Indigo a transformé notre image de façon radicale. Nos clients nous perçoivent maintenant comme une marque sérieuse et cohérente. Le résultat a dépassé nos attentes.",
    rating: 5,
    initial: 'E',
    color: 'from-indigo-600 to-violet-600',
  },
  {
    name: 'Cassandra T.',
    role: 'CEO',
    company: 'Paideia',
    quote: "Un travail rigoureux, à l'écoute, avec une vraie vision business. Pas juste du design — une stratégie complète pour notre positionnement digital.",
    rating: 5,
    initial: 'C',
    color: 'from-violet-600 to-fuchsia-600',
  },
  {
    name: 'Claude C.',
    role: 'Gérante & Propriétaire',
    company: 'Chez Claudie',
    quote: "Je cherchais quelqu'un qui comprenne les besoins des petites entreprises locales. Indigo a su capter l'essence de mon établissement et lui donner une vraie identité.",
    rating: 5,
    initial: 'C',
    color: 'from-cyan-600 to-indigo-600',
  },
];

export default function TestimonialsFunnel() {
  const reduce = useReducedMotion();

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Ils en parlent mieux que nous</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">La confiance, ça se mérite</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={reduce ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-white/65 leading-relaxed mb-5 italic">“{t.quote}”</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.08]">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{t.initial}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
