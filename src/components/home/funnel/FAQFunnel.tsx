'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const FAQ = [
  {
    q: 'Le budget des publicités est-il compris dans le prix ?',
    a: "Non. Le prix couvre mon travail : la création de votre image, de vos visuels, de votre page et la mise en place des publicités. L'argent que vous mettez dans les publicités, lui, va directement à Facebook et reste à votre charge. Je vous conseille un montant adapté à votre formule.",
  },
  {
    q: 'Vous garantissez combien de clients ?',
    a: "Aucun, et personne de sérieux ne devrait vous promettre un chiffre. Ce que je fais, c'est mettre toutes les chances de votre côté : une belle image, une offre claire, une page bien faite et des publicités ciblées. Vous voyez tout ce qui se passe, en toute transparence.",
  },
  {
    q: 'Combien de temps ça prend ?',
    a: "La création de la base (image, visuels, page) prend une dizaine de jours. Ensuite, les publicités tournent pendant la durée de suivi prévue dans votre formule (de 2 semaines à 1 mois et demi selon la formule).",
  },
  {
    q: 'Vous travaillez seulement aux Antilles ?',
    a: "Je suis originaire de Martinique, mais je travaille avec des entreprises partout en France. Tout se fait facilement à distance : par WhatsApp et par appel. Où que vous soyez, c'est moi qui m'occupe de votre projet.",
  },
  {
    q: 'Comment se passe le paiement ?',
    a: "L'offre Essentiel se règle en une fois (490 €). Pour les formules Croissance et Signature, vous pouvez payer en 3 fois sans frais : un premier versement au démarrage, puis deux autres aux dates convenues. Tout est clair dès le début, sans surprise.",
  },
];

export default function FAQFunnel() {
  const reduce = useReducedMotion();

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Questions fréquentes</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Les questions qu'on me pose souvent</h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQ.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm px-5 data-[state=open]:border-indigo-500/30"
            >
              <AccordionTrigger className="text-left text-base font-medium text-white hover:no-underline py-4">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-white/55 leading-relaxed pb-4">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
