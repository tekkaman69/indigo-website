'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import Template from '@/app/template';
import { db } from '@/lib/firebase/config';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query, setDoc,
} from 'firebase/firestore';
import { Plus, Pencil, Trash2, Check, X, Loader2, ChevronLeft, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import GradientButton from '@/components/ui/GradientButton';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PriceVariant { id: string; label: string; price: number; detail: string }

interface ServiceDoc {
  id: string;
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

const EMPTY: Omit<ServiceDoc, 'id'> = {
  serviceId: 'branding',
  title: '',
  tagline: '',
  order: 0,
  singlePrice: undefined,
  priceVariants: undefined,
  tabProcess: [],
  tabInclus: [],
  tabAvantages: [],
};

// ─── Données par défaut (issues de ServicesSection) ──────────────────────────

const DEFAULT_SERVICES: Omit<ServiceDoc, 'id'>[] = [
  {
    serviceId: 'branding',
    title: 'Identité visuelle',
    tagline: 'Une identité visuelle qui inspire confiance et fait la différence dès le premier regard.',
    order: 0,
    singlePrice: 250,
    tabProcess: [
      'Brief & analyse de votre positionnement',
      'Recherche créative & moodboard',
      "Conception de l'identité (logo, couleurs, typo)",
      'Livraison des fichiers sources (AI, PDF, PNG)',
      '2 allers-retours inclus',
    ],
    tabInclus: [
      'Logo principal + variantes',
      'Palette de couleurs officielle',
      'Typographies sélectionnées',
      'Charte graphique simplifiée',
      "Fichiers vectoriels prêts à l'emploi",
    ],
    tabAvantages: [
      'Identité unique et mémorable',
      'Cohérence sur tous vos supports',
      'Image professionnelle immédiate',
      'Base solide pour votre communication',
      'Livraison en 10 jours ouvrés',
    ],
  },
  {
    serviceId: 'contenu',
    title: 'Contenu Social',
    tagline: 'Du contenu calibré pour votre audience, publié régulièrement pour construire votre présence.',
    order: 1,
    priceVariants: [
      { id: 'contenu-1', label: '1/sem', price: 190, detail: '4 publications/mois' },
      { id: 'contenu-2', label: '2/sem', price: 320, detail: '8 publications/mois' },
      { id: 'contenu-3', label: '3/sem', price: 450, detail: '12 publications/mois' },
      { id: 'contenu-4', label: '4/sem', price: 590, detail: '16 publications/mois' },
    ],
    tabProcess: [
      'Définition de la ligne éditoriale',
      'Calendrier éditorial mensuel',
      'Création des visuels & rédaction des captions',
      'Validation avant publication',
      'Rapport de performance mensuel',
    ],
    tabInclus: [
      'Visuels sur-mesure (Figma/After Effects)',
      'Rédaction des légendes',
      'Hashtags stratégiques',
      'Stories & formats complémentaires',
      'Adaptation multi-plateformes',
    ],
    tabAvantages: [
      'Audience qui grandit chaque mois',
      'Crédibilité et confiance renforcées',
      'Libérez votre temps créatif',
      'Contenu cohérent avec votre branding',
      'Engagement mesurable',
    ],
  },
  {
    serviceId: 'site',
    title: 'Site Web',
    tagline: 'Un site qui travaille pour vous 24h/24 — conçu pour convertir, optimisé pour être trouvé.',
    order: 2,
    priceVariants: [
      { id: 'site-statique', label: 'Vitrine statique', price: 500, detail: 'Pour présenter votre activité' },
      { id: 'site-dynamique', label: 'App dynamique', price: 990, detail: 'Pour interagir avec vos clients' },
    ],
    tabProcess: [
      'Audit de vos besoins & maquette',
      'Design UI (Figma) + validation',
      'Développement Next.js (TypeScript)',
      'Tests, optimisations & SEO',
      'Mise en ligne & formation',
    ],
    tabInclus: [
      'Design sur-mesure mobile-first',
      'Formulaire de contact ou prise de RDV',
      'Optimisation SEO on-page',
      'Hébergement conseillé (Vercel)',
      'Contenu rédigé si besoin',
    ],
    tabAvantages: [
      'Performant (Lighthouse 90+)',
      'Référencé dès le lancement',
      'Expérience utilisateur premium',
      'Facile à mettre à jour',
      'Support post-livraison inclus (30j)',
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function variantsToText(variants: PriceVariant[]): string {
  return variants.map((v) => `${v.id} | ${v.label} | ${v.price} | ${v.detail}`).join('\n');
}

function textToVariants(text: string): PriceVariant[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const parts = l.split('|').map((p) => p.trim());
      return { id: parts[0] ?? '', label: parts[1] ?? '', price: Number(parts[2] ?? 0), detail: parts[3] ?? '' };
    })
    .filter((v) => v.id);
}

function linesToArray(text: string): string[] {
  return text.split('\n').map((l) => l.trim()).filter(Boolean);
}

const SERVICE_LABELS: Record<string, string> = {
  branding: 'Identité visuelle',
  contenu: 'Contenu Social',
  site: 'Site Web',
};

// ─── Composant ───────────────────────────────────────────────────────────────

export default function FormulasAdminPage() {
  const [items, setItems] = useState<ServiceDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<Omit<ServiceDoc, 'id'>>(EMPTY);
  // Textareas intermédiaires
  const [variantsText, setVariantsText] = useState('');
  const [processText, setProcessText] = useState('');
  const [inclusText, setInclusText] = useState('');
  const [avantagesText, setAvantagesText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    try {
      const q = query(collection(db, 'formulas'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ServiceDoc)));
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Seed depuis les données actuelles de ServicesSection
  const seed = async () => {
    if (!confirm('Initialiser les 3 services depuis les données actuelles du site ?')) return;
    setIsSeeding(true);
    try {
      for (const s of DEFAULT_SERVICES) {
        await addDoc(collection(db, 'formulas'), s);
      }
      toast({ title: '3 services initialisés avec succès' });
      await load();
    } catch {
      toast({ title: 'Erreur', description: "Impossible d'initialiser", variant: 'destructive' });
    } finally {
      setIsSeeding(false);
    }
  };

  const startCreate = () => {
    setForm({ ...EMPTY, order: items.length });
    setVariantsText(''); setProcessText(''); setInclusText(''); setAvantagesText('');
    setIsCreating(true); setEditingId(null);
  };

  const startEdit = (s: ServiceDoc) => {
    setForm({
      serviceId: s.serviceId, title: s.title, tagline: s.tagline, order: s.order,
      singlePrice: s.singlePrice, priceVariants: s.priceVariants,
      tabProcess: s.tabProcess, tabInclus: s.tabInclus, tabAvantages: s.tabAvantages,
    });
    setVariantsText(s.priceVariants ? variantsToText(s.priceVariants) : '');
    setProcessText(s.tabProcess.join('\n'));
    setInclusText(s.tabInclus.join('\n'));
    setAvantagesText(s.tabAvantages.join('\n'));
    setEditingId(s.id); setIsCreating(false);
  };

  const cancel = () => {
    setEditingId(null); setIsCreating(false); setForm(EMPTY);
    setVariantsText(''); setProcessText(''); setInclusText(''); setAvantagesText('');
  };

  const save = async () => {
    if (!form.title) {
      toast({ title: 'Champ requis', description: 'Le titre est obligatoire', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    const hasVariants = form.serviceId !== 'branding';
    const data: Omit<ServiceDoc, 'id'> = {
      serviceId: form.serviceId,
      title: form.title,
      tagline: form.tagline,
      order: form.order,
      tabProcess: linesToArray(processText),
      tabInclus: linesToArray(inclusText),
      tabAvantages: linesToArray(avantagesText),
      ...(hasVariants
        ? { priceVariants: textToVariants(variantsText) }
        : { singlePrice: form.singlePrice ?? 0 }),
    };
    try {
      if (isCreating) {
        await addDoc(collection(db, 'formulas'), data);
        toast({ title: 'Service créé' });
      } else if (editingId) {
        await updateDoc(doc(db, 'formulas', editingId), data);
        toast({ title: 'Service mis à jour' });
      }
      cancel(); await load();
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: string, title: string) => {
    if (!confirm(`Supprimer le service "${title}" ?`)) return;
    try {
      await deleteDoc(doc(db, 'formulas', id));
      toast({ title: 'Service supprimé' });
      await load();
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const isEditing = isCreating || !!editingId;
  const hasVariants = form.serviceId !== 'branding';

  return (
    <AdminGuard>
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-4xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-white/40 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Gestion des services</h1>
                <p className="text-white/40 text-sm mt-1">
                  Modifiez les prix, textes et contenus affichés dans la section Services
                </p>
              </div>
              {!isEditing && (
                <div className="ml-auto flex gap-2">
                  {items.length === 0 && (
                    <Button
                      variant="ghost"
                      onClick={seed}
                      disabled={isSeeding}
                      className="border border-white/10 text-white/50 hover:text-white text-sm gap-2"
                    >
                      {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                      Initialiser depuis le site
                    </Button>
                  )}
                  <GradientButton onClick={startCreate} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nouveau service
                  </GradientButton>
                </div>
              )}
            </div>

            {/* Formulaire */}
            {isEditing && (
              <Card className="border-indigo-500/30 bg-indigo-500/5">
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    {isCreating ? 'Nouveau service' : `Modifier — ${form.title || '…'}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label>Type de service</Label>
                      <select
                        value={form.serviceId}
                        onChange={(e) => setForm((f) => ({ ...f, serviceId: e.target.value }))}
                        className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white"
                      >
                        <option value="branding">Identité visuelle</option>
                        <option value="contenu">Contenu Social</option>
                        <option value="site">Site Web</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Titre *</Label>
                      <Input
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Branding"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Ordre d'affichage</Label>
                      <Input
                        type="number"
                        value={form.order}
                        onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Accroche</Label>
                    <Input
                      value={form.tagline}
                      onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                      placeholder="Une phrase courte qui décrit ce service"
                    />
                  </div>

                  {/* Prix */}
                  {!hasVariants ? (
                    <div className="space-y-1.5">
                      <Label>Prix unique (€)</Label>
                      <Input
                        type="number"
                        value={form.singlePrice ?? ''}
                        onChange={(e) => setForm((f) => ({ ...f, singlePrice: Number(e.target.value) }))}
                        placeholder="250"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Label>
                        Variantes de prix{' '}
                        <span className="text-white/30 font-normal">— une par ligne : id | label | prix | détail</span>
                      </Label>
                      <Textarea
                        value={variantsText}
                        onChange={(e) => setVariantsText(e.target.value)}
                        rows={form.serviceId === 'contenu' ? 4 : 2}
                        placeholder={
                          form.serviceId === 'contenu'
                            ? 'contenu-1 | 1/sem | 190 | 4 publications/mois\ncontenu-2 | 2/sem | 320 | 8 publications/mois'
                            : 'site-statique | Vitrine statique | 500 | Pour présenter votre activité\nsite-dynamique | App dynamique | 990 | Pour interagir avec vos clients'
                        }
                        className="font-mono text-xs resize-none"
                      />
                    </div>
                  )}

                  {/* Tabs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label>Process <span className="text-white/30 font-normal">(une ligne = un point)</span></Label>
                      <Textarea value={processText} onChange={(e) => setProcessText(e.target.value)} rows={6} className="resize-none text-xs" placeholder="Étape 1&#10;Étape 2" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Inclus</Label>
                      <Textarea value={inclusText} onChange={(e) => setInclusText(e.target.value)} rows={6} className="resize-none text-xs" placeholder="Élément inclus 1&#10;Élément inclus 2" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Avantages</Label>
                      <Textarea value={avantagesText} onChange={(e) => setAvantagesText(e.target.value)} rows={6} className="resize-none text-xs" placeholder="Avantage 1&#10;Avantage 2" />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <GradientButton onClick={save} disabled={isSaving} className="gap-2">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      {isCreating ? 'Créer' : 'Sauvegarder'}
                    </GradientButton>
                    <Button variant="ghost" onClick={cancel} className="gap-2 border border-white/10">
                      <X className="w-4 h-4" />Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Liste */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
            ) : items.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-white/40">
                  Aucun service. Cliquez sur «&nbsp;Initialiser depuis le site&nbsp;» pour charger les données actuelles.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {items.map((s) => (
                  <Card key={s.id} className={`border-white/10 ${editingId === s.id ? 'border-indigo-500/40' : ''}`}>
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-white">{s.title}</span>
                          <span className="text-xs text-white/30 font-mono">{s.serviceId}</span>
                        </div>
                        <p className="text-sm text-white/40 mt-0.5 truncate">{s.tagline}</p>
                        <p className="text-sm font-bold text-indigo-400 mt-1">
                          {s.singlePrice
                            ? `${s.singlePrice}€`
                            : s.priceVariants?.map((v) => `${v.price}€`).join(' · ')}
                        </p>
                        <p className="text-xs text-white/20 mt-1">
                          {s.tabProcess.length} process · {s.tabInclus.length} inclus · {s.tabAvantages.length} avantages
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(s)} className="text-white/40 hover:text-white">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => remove(s.id, s.title)} className="text-white/40 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

          </div>
        </div>
      </Template>
    </AdminGuard>
  );
}
