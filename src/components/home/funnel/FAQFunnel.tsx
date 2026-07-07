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
    q: 'Le budget publicitaire est-il compris dans le prix du pack ?',
    a: "Non. Le prix du pack couvre la création (image, contenu, page de conversion) et la mise en place de la campagne. Le budget publicitaire est versé directement à Meta et reste à votre charge — nous vous conseillons un montant adapté à votre pack.",
  },
  {
    q: 'Garantissez-vous un nombre de clients ?',
    a: "Non, et personne de sérieux ne devrait le faire. Nous mettons en place un système structuré — présence crédible, offre claire, page de conversion et campagne ciblée — pour maximiser vos chances d'obtenir des demandes qualifiées. Vous gardez la visibilité complète sur les performances.",
  },
  {
    q: 'Combien de temps pour mettre en place un pack ?',
    a: "La mise en place de la base (image, contenu, page) prend généralement une dizaine de jours, puis la campagne tourne sur la durée de suivi prévue dans votre pack (14 à 45 jours selon le pack).",
  },
  {
    q: 'Travaillez-vous uniquement en Martinique et Guadeloupe ?',
    a: "C'est notre terrain de prédilection et nous connaissons bien le marché local. Mais nous pouvons accompagner toute TPE/PME francophone à distance — l'essentiel se fait par WhatsApp et appel.",
  },
  {
    q: 'Comment se passe le paiement ?',
    a: "Un acompte de 50 % au démarrage, le solde à la livraison. Tout est cadré dès le départ, sans surprise.",
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
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ce qu'on nous demande souvent</h2>
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
