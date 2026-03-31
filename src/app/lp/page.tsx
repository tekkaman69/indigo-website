'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageCircle, Check, Star, ChevronRight, TrendingUp, ArrowRight, Tag, AlertCircle } from 'lucide-react';
import { getFeaturedPortfolioItems } from '@/lib/firebase/firestore';
import type { PortfolioItem } from '@/types/firebase';

// ─── Config WhatsApp ──────────────────────────────────────────────────────────

const WA_NUMBER  = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '596XXXXXXXXX';
const WA_MESSAGE = encodeURIComponent("Bonjour, j'ai vu votre site et j'aimerais en savoir plus sur l'audit gratuit.");
const WA_URL     = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function WhatsAppButton({ label = "Prendre rendez-vous sur WhatsApp", size = 'md' }: { label?: string; size?: 'sm' | 'md' | 'lg' }) {
  const classes = {
    sm:  'px-5 py-2.5 text-sm gap-2',
    md:  'px-7 py-3.5 text-base gap-2.5',
    lg:  'px-8 py-4 text-lg gap-3',
  }[size];

  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center font-semibold rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 ${classes}`}
    >
      <MessageCircle className="w-5 h-5 flex-shrink-0" />
      {label}
    </a>
  );
}

// ─── Floating WhatsApp FAB ────────────────────────────────────────────────────

function WhatsAppFAB() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] flex items-center justify-center shadow-xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-110 transition-all duration-200"
      aria-label="Nous contacter sur WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 border-2 border-gray-950 animate-pulse" />
    </a>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────

function Divider() {
  return <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />;
}

// ─── 1. HERO ──────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-24 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute rounded-full blur-[140px]" style={{ width: '60vw', height: '60vh', top: '5%', left: '20%', background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 65%)' }} />
        <div className="absolute rounded-full blur-[100px]" style={{ width: '30vw', height: '40vh', bottom: '10%', right: '10%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%)' }} />
        {/* Grain */}
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute" style={{ inset: '-10%', width: '120%', height: '120%', opacity: 0.09, mixBlendMode: 'screen' }}>
          <defs>
            <filter id="lpGrain">
              <feTurbulence type="fractalNoise" baseFrequency="0.55 0.55" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.39  0 0 0 0 0.40  0 0 0 0 0.95  0.33 0.33 0.33 0 0" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#lpGrain)" />
        </svg>
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Badge géographique */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
          Martinique · Guadeloupe · Antilles
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6"
        >
          Vos futurs clients vous jugent{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            avant même de vous parler.
          </span>
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          En Martinique et Guadeloupe, les TPE qui attirent des clients en ligne ont un point commun : une image cohérente, professionnelle, qui inspire confiance dès la première seconde.
        </motion.p>

        {/* CTA principal */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center gap-3"
        >
          <WhatsAppButton label="Obtenir mon audit gratuit" size="lg" />
          <p className="text-sm text-white/35">20 minutes · Zéro engagement · Résultats concrets</p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-14 flex items-center justify-center gap-8 flex-wrap text-sm text-white/30"
        >
          <span className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" />12+ entreprises accompagnées</span>
          <span className="w-px h-4 bg-white/10 hidden sm:block" />
          <span className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" />Livraison en 10 jours</span>
          <span className="w-px h-4 bg-white/10 hidden sm:block" />
          <span className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" />Résultats mesurables</span>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 2. PROBLÈME ─────────────────────────────────────────────────────────────

const PROBLEMS = [
  {
    icon: '🪞',
    title: "Votre image ne reflète pas la qualité de votre travail.",
    body: "Vous faites un excellent boulot. Mais votre logo, vos visuels ou votre site ne le montrent pas — et vos prospects partent chez quelqu'un qui semble plus \"sérieux\".",
  },
  {
    icon: '📱',
    title: "Vous postez sur les réseaux, mais ça n'apporte pas de clients.",
    body: "Likes, abonnés… mais peu de vrais contacts. Le contenu sans stratégie ni cohérence visuelle ne convertit pas — il occupe juste du temps.",
  },
  {
    icon: '🔍',
    title: "Votre site existe, mais il ne génère pas de demandes.",
    body: "Votre site est en ligne — mais il n'est pas trouvé, pas convaincant, ou pas adapté au mobile. Résultat : vos concurrents captent les clients à votre place.",
  },
];

function ProblemSection() {
  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Vous reconnaissez-vous ?</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ce que vivent la plupart des TPE/PME aux Antilles
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROBLEMS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6"
            >
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="text-base font-semibold text-white mb-2 leading-snug">{p.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA discret */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-white/40 text-sm mb-4">Si vous vous reconnaissez dans l'une de ces situations — on peut changer ça.</p>
          <WhatsAppButton label="En parler sur WhatsApp" size="sm" />
        </motion.div>
      </div>
    </section>
  );
}

// ─── 3. PROJETS / PREUVES ─────────────────────────────────────────────────────

function ProjectCard({ item, index }: { item: PortfolioItem; index: number }) {
  const coverUrl = item.coverImage?.url || item.imageUrl || '';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden"
    >
      {coverUrl && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={coverUrl}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            quality={85}
            className="object-cover"
            style={{ objectPosition: item.coverPosition ?? 'center' }}
          />
          {item.industry && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-xs text-white/80 backdrop-blur-sm">
                <Tag className="w-2.5 h-2.5" />
                {item.industry}
              </span>
            </div>
          )}
        </div>
      )}
      <div className="p-5">
        <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
        {item.category && (
          <p className="text-xs text-indigo-400 uppercase tracking-widest mb-2">{item.category}</p>
        )}
        {item.result && (
          <div className="flex items-start gap-2 mt-2">
            <TrendingUp className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-400/80 font-medium">{item.result}</p>
          </div>
        )}
        {!item.result && item.description && (
          <p className="text-xs text-white/45 line-clamp-2">{item.description}</p>
        )}
      </div>
    </motion.div>
  );
}

function ProofSection() {
  const [items, setItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    getFeaturedPortfolioItems()
      .then(results => setItems(results.slice(0, 3)))
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Résultats réels</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ce que nous avons construit ensemble
          </h2>
          <p className="mt-3 text-white/45 max-w-xl mx-auto">Des entreprises antillaises qui ont fait confiance à Indigo — et dont l'image a changé.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <ProjectCard key={item.id} item={item} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <WhatsAppButton label="Je veux un résultat comme ça" size="md" />
        </motion.div>
      </div>
    </section>
  );
}

// ─── 4. TÉMOIGNAGES ──────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: 'Emmanuel D.',
    role: 'CEO',
    company: 'Suteki',
    quote: 'Indigo a transformé notre image de façon radicale. Nos clients nous perçoivent maintenant comme une marque sérieuse et cohérente. Le résultat a dépassé nos attentes.',
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

function TestimonialsSection() {
  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Ils en parlent mieux que nous</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            La confiance, ça se mérite
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-white/65 leading-relaxed mb-5 italic">"{t.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/8">
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

// ─── 5. OFFRE ────────────────────────────────────────────────────────────────

const OFFERS = [
  { label: 'Branding essentiel',  price: '490€',      detail: 'Logo, couleurs, typographie, charte simplifiée' },
  { label: 'Branding complet',    price: '790€',      detail: 'Essentiel + templates réseaux, mockups, fichiers sources' },
  { label: 'Site vitrine',        price: '790€',      detail: 'Design + développement + SEO' },
  { label: 'App dynamique',       price: '1 490€',    detail: 'Site interactif avec espace client ou fonctions avancées' },
  { label: 'Site + Branding',     price: '1 190€',    detail: 'Offre phare — branding essentiel + site vitrine (90€ offerts)', highlight: true },
  { label: 'Contenu social',      price: 'dès 290€',  detail: '4 à 8 publications/mois, alignées à votre image', unit: '/mois' },
];

function OfferSection() {
  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Audit gratuit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-md p-8 mb-10 text-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 text-sm mb-5">
            <AlertCircle className="w-3.5 h-3.5" />
            Offre d'entrée — gratuit, sans engagement
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Audit visuel gratuit<br />
            <span className="text-indigo-300">en 20 minutes</span>
          </h2>
          <p className="text-white/55 mb-6 max-w-lg mx-auto leading-relaxed">
            On analyse votre image actuelle — logo, site, réseaux — et on vous donne <strong className="text-white/80">3 axes d'amélioration concrets</strong>. Zéro jargon. Zéro engagement. Juste ce dont vous avez besoin pour avancer.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-7 text-sm text-white/50">
            {['20 minutes chrono','Par WhatsApp ou appel','Réponse sous 24h','Aucun engagement'].map(item => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-indigo-400" />{item}
              </span>
            ))}
          </div>
          <WhatsAppButton label="Je veux mon audit gratuit" size="lg" />
        </motion.div>

        {/* Pricing overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-center text-xs uppercase tracking-widest text-white/30 mb-5">Nos tarifs — transparents, fixes, sans surprise</p>
          <div className="space-y-2">
            {OFFERS.map((o, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-5 py-3.5 rounded-xl border transition-colors ${
                  o.highlight
                    ? 'border-indigo-500/40 bg-indigo-500/10'
                    : 'border-white/8 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {o.highlight && <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold uppercase tracking-wider">Phare</span>}
                  <div>
                    <p className={`text-sm font-medium ${o.highlight ? 'text-white' : 'text-white/80'}`}>{o.label}</p>
                    <p className="text-xs text-white/35">{o.detail}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold tabular-nums ${o.highlight ? 'text-indigo-300' : 'text-white/60'}`}>
                  {o.price}{o.unit ?? ''}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-white/25 mt-4">Acompte 50% au démarrage · Solde à la livraison</p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 6. FINAL CTA ─────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="w-full py-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à changer la perception<br />de votre entreprise ?
          </h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            Un audit gratuit. 20 minutes. Trois recommandations concrètes.<br />
            On vous répond sous 24h.
          </p>
          <WhatsAppButton label="Démarrer mon audit gratuit maintenant" size="lg" />
          <p className="mt-4 text-sm text-white/25">Indigo · Martinique & Guadeloupe</p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[hsl(236,41%,4%)] text-white overflow-x-hidden">

      {/* Background global */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 60%)' }} />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <Divider />
        <ProblemSection />
        <Divider />
        <ProofSection />
        <Divider />
        <TestimonialsSection />
        <Divider />
        <OfferSection />
        <FinalCTA />
      </div>

      {/* Floating WhatsApp */}
      <WhatsAppFAB />
    </div>
  );
}
