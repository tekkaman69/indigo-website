'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const faqs = [
  {
    question: 'Comment fonctionne le paiement en acompte ?',
    answer:
      'Vous réglez 50% du montant total au démarrage du projet via Lemon Squeezy (carte bancaire sécurisée). Le solde restant est dû à la livraison finale. Cette structure vous protège : vous ne payez l\'intégralité que si vous êtes satisfait du livrable.',
  },
  {
    question: 'Quels sont les délais de livraison ?',
    answer:
      'Les délais varient selon le service : Branding (10 jours ouvrés), Contenu (démarrage sous 5 jours), Site web statique (2 à 3 semaines), Site dynamique (4 à 6 semaines). Ces délais sont indiqués à titre indicatif et dépendent de votre réactivité sur les validations.',
  },
  {
    question: 'Puis-je payer par virement bancaire ?',
    answer:
      'Oui. Sur la page de checkout, cliquez sur "Je préfère payer par virement". Envoyez votre demande et nous vous communiquerons les coordonnées bancaires par email dans les 24h. Le projet démarrera dès réception du virement.',
  },
  {
    question: 'Que se passe-t-il après le paiement de l\'acompte ?',
    answer:
      'Vous recevrez un email de confirmation, puis nous vous contacterons sous 48h pour planifier un appel de briefing. Vous recevrez également un questionnaire détaillé pour cadrer précisément votre projet avant la production.',
  },
  {
    question: 'Combien d\'allers-retours sont inclus ?',
    answer:
      'Chaque service inclut au minimum 2 cycles de révisions. Pour le branding, cela signifie 2 retours sur les propositions créatives. Pour le contenu, chaque publication est validée avant publication. Pour les sites, les retours sont gérés via un document partagé.',
  },
  {
    question: 'Puis-je commander plusieurs services ensemble ?',
    answer:
      'Absolument. Branding + Contenu + Site forment un package cohérent très efficace. Contactez-nous via "Discuter avant commande" pour qu\'on évalue ensemble la combinaison la plus adaptée à vos besoins et votre budget.',
  },
];

export default function FAQSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="faq" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Questions fréquentes</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Tout ce que vous voulez savoir
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-5 data-[state=open]:border-indigo-500/30 data-[state=open]:bg-white/8 transition-colors"
                >
                  <AccordionTrigger className="py-4 text-left text-sm font-medium text-white hover:text-indigo-300 hover:no-underline transition-colors [&[data-state=open]]:text-indigo-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm text-white/55 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
