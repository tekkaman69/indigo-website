'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import Template from '@/app/template';
import { db } from '@/lib/firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from 'firebase/firestore';
import { Plus, Pencil, Trash2, Check, X, Loader2, ChevronLeft, Star, Quote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import GradientButton from '@/components/ui/GradientButton';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatarUrl: string;
  featured: boolean;
  order: number;
}

const EMPTY: Omit<Testimonial, 'id'> = {
  name: '',
  role: '',
  company: '',
  quote: '',
  rating: 5,
  avatarUrl: '',
  featured: false,
  order: 0,
};

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<Omit<Testimonial, 'id'>>(EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const DEFAULT_TESTIMONIALS: Omit<Testimonial, 'id'>[] = [
    {
      name: 'Emmanuel D.',
      role: 'CEO',
      company: 'Suteki',
      quote: 'Indigo a livré bien au-delà de nos attentes. La plateforme en ligne est fluide, moderne et parfaitement représentative de notre univers. La direction artistique couvre tous nos projets avec une cohérence impressionnante — chaque visuel raconte notre histoire. Un partenaire de confiance que je recommande sans hésiter.',
      rating: 5,
      avatarUrl: '',
      featured: true,
      order: 0,
    },
    {
      name: 'Cassandra T.',
      role: 'CEO',
      company: 'Paideia',
      quote: 'Travailler avec Indigo pour notre plateforme éducative a été une expérience remarquable. Ils ont saisi dès le départ l\'ambition pédagogique de Paideia et l\'ont traduite en une interface claire, engageante et à l\'identité visuelle forte. Résultat : nos apprenants s\'y retrouvent immédiatement et nos partenaires institutionnels prennent confiance dès le premier regard.',
      rating: 5,
      avatarUrl: '',
      featured: true,
      order: 1,
    },
    {
      name: 'Claude C.',
      role: 'Gérante & Propriétaire',
      company: 'Chez Claudie',
      quote: 'Mon site de présentation et de réservation pour l\'hébergement a tout changé. Les clients peuvent désormais découvrir l\'établissement en quelques secondes et réserver directement en ligne. Indigo a su capturer l\'âme chaleureuse de "Chez Claudie" — simple, élégant, efficace. Je reçois des compliments sur le site aussi souvent que sur les chambres !',
      rating: 5,
      avatarUrl: '',
      featured: true,
      order: 2,
    },
  ];

  const seedDefaultTestimonials = async () => {
    if (!confirm('Ajouter les 3 témoignages par défaut ? (ils s\'ajouteront aux existants)')) return;
    setIsSeeding(true);
    try {
      for (const t of DEFAULT_TESTIMONIALS) {
        await addDoc(collection(db, 'testimonials'), t);
      }
      toast({ title: '3 témoignages ajoutés avec succès' });
      await load();
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de créer les témoignages', variant: 'destructive' });
    } finally {
      setIsSeeding(false);
    }
  };

  const load = async () => {
    try {
      const q = query(collection(db, 'testimonials'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Testimonial)));
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    setForm({ ...EMPTY, order: items.length });
    setIsCreating(true);
    setEditingId(null);
  };

  const startEdit = (t: Testimonial) => {
    setForm({ name: t.name, role: t.role, company: t.company, quote: t.quote, rating: t.rating, avatarUrl: t.avatarUrl, featured: t.featured, order: t.order });
    setEditingId(t.id);
    setIsCreating(false);
  };

  const cancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setForm(EMPTY);
  };

  const save = async () => {
    if (!form.name || !form.quote) {
      toast({ title: 'Champs requis', description: 'Nom et témoignage sont obligatoires', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      if (isCreating) {
        await addDoc(collection(db, 'testimonials'), form);
        toast({ title: 'Témoignage créé' });
      } else if (editingId) {
        await updateDoc(doc(db, 'testimonials', editingId), form);
        toast({ title: 'Témoignage mis à jour' });
      }
      cancel();
      await load();
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Supprimer le témoignage de "${name}" ?`)) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      toast({ title: 'Témoignage supprimé' });
      await load();
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const isEditing = isCreating || !!editingId;

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
                <h1 className="text-3xl font-bold text-white">Gestion des témoignages</h1>
                <p className="text-white/40 text-sm mt-1">Ajoutez et modifiez les avis clients affichés sur le site</p>
              </div>
              {!isEditing && (
                <div className="ml-auto flex gap-2">
                  {items.length === 0 && (
                    <Button
                      variant="ghost"
                      onClick={seedDefaultTestimonials}
                      disabled={isSeeding}
                      className="border border-white/10 text-white/50 hover:text-white text-sm gap-2"
                    >
                      {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                      Pré-remplir
                    </Button>
                  )}
                  <GradientButton onClick={startCreate} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nouveau témoignage
                  </GradientButton>
                </div>
              )}
            </div>

            {/* Formulaire */}
            {isEditing && (
              <Card className="border-indigo-500/30 bg-indigo-500/5">
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    {isCreating ? 'Nouveau témoignage' : 'Modifier le témoignage'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Témoignage *</Label>
                    <Textarea
                      value={form.quote}
                      onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                      rows={4}
                      placeholder="Ce que le client a dit..."
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label>Nom *</Label>
                      <Input
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Marie Dupont"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Rôle / Poste</Label>
                      <Input
                        value={form.role}
                        onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                        placeholder="Directrice Marketing"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Entreprise</Label>
                      <Input
                        value={form.company}
                        onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                        placeholder="Acme Corp"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>URL avatar (optionnel)</Label>
                      <Input
                        value={form.avatarUrl}
                        onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Note (1-5)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        value={form.rating}
                        onChange={(e) => setForm((f) => ({ ...f, rating: Math.min(5, Math.max(1, Number(e.target.value))) }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Ordre</Label>
                      <Input
                        type="number"
                        value={form.order}
                        onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.featured}
                          onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                          className="w-4 h-4 accent-indigo-500"
                        />
                        <span className="text-sm text-white/70">Mettre en avant</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <GradientButton onClick={save} disabled={isSaving} className="gap-2">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      {isCreating ? 'Créer' : 'Sauvegarder'}
                    </GradientButton>
                    <Button variant="ghost" onClick={cancel} className="gap-2 border border-white/10">
                      <X className="w-4 h-4" />
                      Annuler
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
                  Aucun témoignage. Ajoutez-en un ci-dessus.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {items.map((t) => (
                  <Card key={t.id} className={`border-white/10 ${editingId === t.id ? 'border-indigo-500/40' : ''}`}>
                    <CardContent className="p-4 flex items-start gap-4">
                      <Quote className="w-5 h-5 text-indigo-400/40 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/70 line-clamp-2 mb-2">{t.quote}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-white">{t.name}</span>
                          {t.role && <span className="text-xs text-white/40">{t.role}</span>}
                          {t.company && <span className="text-xs text-white/30">· {t.company}</span>}
                          {t.featured && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                              En vedette
                            </span>
                          )}
                          <div className="flex items-center gap-0.5 ml-auto">
                            {Array.from({ length: t.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(t)} className="text-white/40 hover:text-white">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => remove(t.id, t.name)} className="text-white/40 hover:text-red-400">
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
