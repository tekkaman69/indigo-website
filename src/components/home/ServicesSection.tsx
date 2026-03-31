'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Palette, Share2, Globe, Check, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GradientButton from '@/components/ui/GradientButton';
import { Button } from '@/components/ui/button';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

// ============================================
// Types
// ============================================

interface TabData {
  process: string[];
  inclus: string[];
  avantages: string[];
}

interface PriceVariant {
  id: string;
  label: string;
  price: number;
  detail: string;
}

interface ServiceData {
  id: string;
  icon: React.ElementType;
  title: string;
  tagline: string;
  badge?: string;
  singlePrice?: number;
  priceVariants?: PriceVariant[];
  tabs: TabData;
}

// ============================================
// Icônes par serviceId
// ============================================

const ICON_MAP: Record<string, React.ElementType> = {
  branding: Palette,
  contenu: Share2,
  site: Globe,
};

// ============================================
// Données services (fallback statique)
// ============================================

const STATIC_SERVICES: ServiceData[] = [
  {
    id: 'branding',
    icon: Palette,
    title: 'Branding',
    tagline: 'Une identité visuelle qui inspire confiance et fait la différence dès le premier regard.',
    priceVariants: [
      { id: 'branding',         label: 'Essentiel', price: 490, detail: 'Logo, couleurs, typo, charte simplifiée' },
      { id: 'branding-complet', label: 'Complet',   price: 790, detail: 'Essentiel + templates réseaux, mockups, fichiers sources étendus' },
    ],
    tabs: {
      process: [
        'Brief & analyse de votre positionnement',
        'Recherche créative & moodboard',
        'Conception de l\'identité (logo, couleurs, typo)',
        'Livraison des fichiers sources (AI, PDF, PNG)',
        '2 allers-retours inclus',
      ],
      inclus: [
        'Logo principal + variantes',
        'Palette de couleurs officielle',
        'Typographies sélectionnées',
        'Charte graphique simplifiée',
        'Fichiers vectoriels prêts à l\'emploi',
        'Templates réseaux sociaux ×3 (Complet)',
        'Mockups visuels (Complet)',
      ],
      avantages: [
        'Identité unique et mémorable',
        'Cohérence sur tous vos supports',
        'Image professionnelle immédiate',
        'Base solide pour votre communication',
        'Livraison en 10 jours ouvrés',
      ],
    },
  },
  {
    id: 'contenu',
    icon: Share2,
    title: 'Contenu Social',
    tagline: 'Du contenu calibré pour votre audience, publié régulièrement pour construire votre présence.',
    priceVariants: [
      { id: 'contenu-1', label: '4 posts/mois', price: 290, detail: '1 publication par semaine' },
      { id: 'contenu-2', label: '8 posts/mois', price: 490, detail: '2 publications par semaine' },
    ],
    tabs: {
      process: [
        'Définition de la ligne éditoriale',
        'Calendrier éditorial mensuel',
        'Création des visuels & rédaction des captions',
        'Validation avant publication',
        'Rapport de performance mensuel',
      ],
      inclus: [
        'Visuels sur-mesure (Figma/After Effects)',
        'Rédaction des légendes',
        'Hashtags stratégiques',
        'Stories & formats complémentaires',
        'Adaptation multi-plateformes',
      ],
      avantages: [
        'Audience qui grandit chaque mois',
        'Crédibilité et confiance renforcées',
        'Libérez votre temps créatif',
        'Contenu cohérent avec votre branding',
        'Engagement mesurable',
      ],
    },
  },
  {
    id: 'site',
    icon: Globe,
    title: 'Site Web',
    tagline: 'Un site qui travaille pour vous 24h/24 — conçu pour convertir, optimisé pour être trouvé.',
    priceVariants: [
      { id: 'site-statique',  label: 'Vitrine statique', price: 790,  detail: 'Pour présenter votre activité' },
      { id: 'site-dynamique', label: 'App dynamique',    price: 1490, detail: 'Pour interagir avec vos clients' },
    ],
    tabs: {
      process: [
        'Audit de vos besoins & maquette',
        'Design UI (Figma) + validation',
        'Développement & intégration',
        'Tests, optimisations & SEO',
        'Mise en ligne & formation',
      ],
      inclus: [
        'Design sur-mesure mobile-first',
        'Formulaire de contact ou prise de RDV',
        'Optimisation SEO on-page',
        'Hébergement conseillé (Vercel)',
        'Contenu rédigé si besoin',
      ],
      avantages: [
        'Performant (score 90+ garanti)',
        'Référencé dès le lancement',
        'Expérience utilisateur premium',
        'Facile à mettre à jour',
        'Support post-livraison inclus (30j)',
      ],
    },
  },
];

// ============================================
// Mapping doc Firestore → ServiceData
// ============================================

interface FirestoreServiceDoc {
  serviceId: string;
  title: string;
  tagline: string;
  order: number;
  singlePrice?: number;
  priceVariants?: PriceVariant[];
  tabProcess: string[];
  tabInclus: string[];
  tabAvantages: string[];
}

function mapDocToService(doc: FirestoreServiceDoc): ServiceData {
  return {
    id: doc.serviceId,
    icon: ICON_MAP[doc.serviceId] ?? Globe,
    title: doc.title,
    tagline: doc.tagline,
    ...(doc.singlePrice !== undefined ? { singlePrice: doc.singlePrice } : {}),
    ...(doc.priceVariants ? { priceVariants: doc.priceVariants } : {}),
    tabs: {
      process: doc.tabProcess ?? [],
      inclus: doc.tabInclus ?? [],
      avantages: doc.tabAvantages ?? [],
    },
  };
}

// ============================================
// Tabs glassmorphism pill style
// ============================================

const TAB_LABELS: Record<keyof TabData, string> = {
  process: 'Process',
  inclus: 'Inclus',
  avantages: 'Avantages',
};

// ============================================
// ServiceBlock
// ============================================

function ServiceBlock({ service, index }: { service: ServiceData; index: number }) {
  const shouldReduceMotion = useReducedMotion();
  const [selectedVariant, setSelectedVariant] = useState<string>(
    service.priceVariants ? service.priceVariants[0].id : ''
  );

  const currentVariant = service.priceVariants?.find((v) => v.id === selectedVariant);
  const displayPrice = service.singlePrice ?? currentVariant?.price ?? 0;
  const checkoutOffer = service.singlePrice ? service.id : selectedVariant;

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <service.icon className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white">{service.title}</h3>
            <p className="text-sm text-white/50 mt-1 leading-snug">{service.tagline}</p>
          </div>
        </div>

        {/* Price variants selector (pour Contenu et Site) */}
        {service.priceVariants && (
          <div className="mb-6">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">
              {service.id === 'contenu' ? 'Fréquence de publication' : 'Formule'}
            </p>
            <div
              className={cn(
                'flex flex-wrap gap-2',
                service.id === 'site' ? 'flex-col sm:flex-row' : ''
              )}
            >
              {service.priceVariants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant.id)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
                    selectedVariant === variant.id
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-lg shadow-indigo-500/20'
                      : 'border-white/10 text-white/50 hover:text-white/80 hover:border-white/20'
                  )}
                >
                  {variant.label}
                  {service.id !== 'contenu' && (
                    <span className="ml-2 text-xs opacity-70">{variant.price}€</span>
                  )}
                </button>
              ))}
            </div>
            {currentVariant && service.id === 'contenu' && (
              <p className="text-xs text-white/30 mt-2">{currentVariant.detail}</p>
            )}
            {currentVariant && service.id === 'site' && (
              <p className="text-xs text-white/30 mt-2">{currentVariant.detail}</p>
            )}
          </div>
        )}

        {/* Prix */}
        <div className="mb-6 flex items-baseline gap-2">
          <span className="text-4xl font-black text-white">{displayPrice}€</span>
          {service.id === 'contenu' && (
            <span className="text-white/40 text-sm">/mois</span>
          )}
          <span className="text-xs text-white/30 ml-auto">Acompte 50% au démarrage</span>
        </div>

        {/* Tabs glassmorphism */}
        <Tabs defaultValue="process" className="mb-6">
          <TabsList className="inline-flex h-auto gap-1 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 p-1 mb-4">
            {(Object.keys(TAB_LABELS) as Array<keyof TabData>).map((tabKey) => (
              <TabsTrigger
                key={tabKey}
                value={tabKey}
                className={cn(
                  'rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200',
                  'text-white/50 hover:text-white/80',
                  'data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-violet-600',
                  'data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20'
                )}
              >
                {TAB_LABELS[tabKey]}
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.keys(TAB_LABELS) as Array<keyof TabData>).map((tabKey) => (
            <TabsContent key={tabKey} value={tabKey} className="mt-0">
              <ul className="space-y-2">
                {service.tabs[tabKey].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                    <Check className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          ))}
        </Tabs>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <GradientButton
            href={`/checkout?offer=${checkoutOffer}`}
            className="flex-1 py-3 text-sm justify-center whitespace-nowrap"
          >
            Démarrer mon projet
            <ChevronRight className="w-4 h-4 ml-1 flex-shrink-0" />
          </GradientButton>
          <Button
            asChild
            variant="ghost"
            className="flex-1 border border-white/10 hover:bg-white/5 text-white/60 hover:text-white text-sm"
          >
            <Link href="/contact">Discuter d'abord</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Section principale
// ============================================

export default function ServicesSection() {
  const shouldReduceMotion = useReducedMotion();
  const [services, setServices] = useState<ServiceData[]>(STATIC_SERVICES);

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, 'formulas'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docs = snap.docs.map((d) => d.data() as FirestoreServiceDoc);
          setServices(docs.map(mapDocToService));
        }
      } catch {
        // Fallback silencieux vers les données statiques
      }
    };
    load();
  }, []);

  return (
    <section id="services" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Nos services</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Tout ce qu'il faut pour exister en ligne
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            Trois expertises complémentaires, une vision commune : votre croissance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {services.map((service, index) => (
            <ServiceBlock key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* ── Offre phare : Site + Branding ── */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-5 relative overflow-hidden rounded-xl border border-indigo-500/40 bg-indigo-500/5 backdrop-blur-md"
        >
          {/* Top accent line renforcée */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">

              {/* Badge + titre */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider">
                    Offre phare
                  </span>
                  <span className="px-3 py-1 rounded-full border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                    Recommandé pour démarrer
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">Site + Branding</h3>
                <p className="text-white/50 text-sm max-w-xl">
                  Le système complet pour une présence digitale cohérente : identité visuelle + site web conçus ensemble, pensés pour convertir.
                </p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/40">
                  {['Logo + charte graphique', 'Site vitrine sur-mesure', 'Cohérence visuelle totale', 'Livraison en 3 semaines'].map(item => (
                    <span key={item} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-indigo-400" />{item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prix + CTA */}
              <div className="flex flex-col items-start lg:items-end gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">1 190€</span>
                  </div>
                  <p className="text-xs text-white/30 mt-1">
                    490€ + 790€ = 1 280€ séparément —{' '}
                    <span className="text-indigo-400 font-medium">90€ offerts</span>
                  </p>
                  <p className="text-xs text-white/25 mt-0.5">Acompte 50% au démarrage</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <GradientButton
                    href="/checkout?offer=site-branding"
                    className="py-3 text-sm justify-center whitespace-nowrap px-6"
                  >
                    Démarrer mon projet
                    <ChevronRight className="w-4 h-4 ml-1 flex-shrink-0" />
                  </GradientButton>
                  <Button
                    asChild
                    variant="ghost"
                    className="border border-white/10 hover:bg-white/5 text-white/60 hover:text-white text-sm"
                  >
                    <Link href="/contact">Discuter d'abord</Link>
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
