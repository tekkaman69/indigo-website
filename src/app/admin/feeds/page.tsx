'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminGuard } from '@/components/admin/AdminGuard';
import Template from '@/app/template';
import Image from 'next/image';
import { getAllInstaFeeds, addInstaFeed, deleteInstaFeed, updateInstaFeed } from '@/lib/firebase/firestore';
import type { InstaFeed } from '@/types/firebase';
import { FEED_SLOT_COUNT } from '@/types/firebase';
import PlaceholderMesh from '@/components/showcase/PlaceholderMesh';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Loader2, Info, Grid3x3, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

/** Aperçu en lecture seule d'un feed — mini grille 3×3 des visuels. */
function InstaFeedPreview({ feed }: { feed: InstaFeed }) {
  const slots = Array.from({ length: FEED_SLOT_COUNT }, (_, i) => feed.slots?.[i]);
  const filled = slots.filter(s => s?.url).length;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors group-hover:border-cyan-400/50">
      <div className="grid grid-cols-3 gap-0.5 p-1">
        {slots.map((slot, i) => (
          <div key={i} className="relative overflow-hidden rounded-sm aspect-[4/5] bg-white/5">
            {slot?.url ? (
              <Image
                src={slot.url}
                alt=""
                fill
                sizes="120px"
                quality={70}
                className="object-cover"
                style={{ objectPosition: `${slot.focalPoint?.x ?? 50}% ${slot.focalPoint?.y ?? 50}%` }}
              />
            ) : (
              <PlaceholderMesh seed={`${feed.id}-${i}`} className="h-full w-full" />
            )}
          </div>
        ))}
      </div>
      <div className="px-4 py-3">
        <p className="text-[11px] uppercase tracking-widest text-cyan-300/80 mb-0.5">
          Feed Instagram · {filled}/{FEED_SLOT_COUNT} visuels
        </p>
        <h3 className="text-sm font-semibold text-white truncate">{feed.clientName || 'Sans nom'}</h3>
      </div>
    </div>
  );
}

/**
 * Liste des feeds Instagram — CRUD complet (créer, configurer, publier,
 * supprimer). Entité indépendante de home_projects.
 */
export default function FeedsPickerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [feeds, setFeeds] = useState<InstaFeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const loadFeeds = () => {
    setIsLoading(true);
    getAllInstaFeeds()
      .then(setFeeds)
      .catch(err => console.error('Error loading insta feeds:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadFeeds();
  }, []);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const id = await addInstaFeed({
        clientName: '',
        slots: Array.from({ length: FEED_SLOT_COUNT }, () => ({ url: '' })),
        published: false,
        order: feeds.length,
      });
      router.push(`/admin/feeds/${id}`);
    } catch (err) {
      console.error('Error creating insta feed:', err);
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Impossible de créer le feed.',
        variant: 'destructive',
      });
      setIsCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Supprimer ce feed ?')) return;
    await deleteInstaFeed(id);
    loadFeeds();
  };

  const handleTogglePublished = async (e: React.MouseEvent, feed: InstaFeed) => {
    e.preventDefault();
    e.stopPropagation();
    await updateInstaFeed(feed.id, { published: !feed.published });
    loadFeeds();
  };

  return (
    <AdminGuard>
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-12 text-white">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-4">
                <Link href="/admin" className="text-white/40 hover:text-white transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Feeds Instagram</h1>
                  <p className="text-sm text-white/40 mt-0.5">
                    Mosaïques 3×3 de feeds Insta affichées sur la home
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCreate}
                disabled={isCreating}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium transition-colors"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Nouveau feed
              </button>
            </div>

            {/* Bandeau d'aide */}
            <div className="flex items-start gap-2.5 mb-8 px-4 py-3 rounded-lg border border-indigo-500/20 bg-indigo-500/[0.07] text-sm text-white/60">
              <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p>
                Chaque feed contient 9 visuels au format 4:5. Seuls les feeds{' '}
                <strong className="text-white/80">publiés</strong> apparaissent sur la home.
                Utilisez le bouton œil pour publier/dépublier.
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
            ) : feeds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-xl text-white/30">
                <Grid3x3 className="w-10 h-10 mb-3" />
                <p className="text-sm">Aucun feed pour le moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {feeds.map(feed => (
                  <Link key={feed.id} href={`/admin/feeds/${feed.id}`} className="block relative group">
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleTogglePublished(e, feed)}
                        title={feed.published ? 'Publié — cliquer pour dépublier' : 'Brouillon — cliquer pour publier'}
                        className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${
                          feed.published ? 'bg-indigo-500/80 text-white' : 'bg-black/50 text-white/50 border border-dashed border-white/20'
                        }`}
                      >
                        {feed.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, feed.id)}
                        title="Supprimer"
                        className="p-1.5 rounded-full bg-black/50 text-white/50 hover:text-red-400 backdrop-blur-sm transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <InstaFeedPreview feed={feed} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </Template>
    </AdminGuard>
  );
}
