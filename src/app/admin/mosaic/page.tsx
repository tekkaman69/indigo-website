'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminGuard } from '@/components/admin/AdminGuard';
import Template from '@/app/template';
import Image from 'next/image';
import { getAllHomeProjects, addHomeProject, deleteHomeProject, updateHomeProject } from '@/lib/firebase/firestore';
import type { HomeProject } from '@/types/firebase';
import { MOSAIC_TEMPLATES } from '@/components/showcase/mosaicTemplates';
import PlaceholderMesh from '@/components/showcase/PlaceholderMesh';
import { ChevronLeft, Loader2, Info, LayoutGrid, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

/**
 * Aperçu en lecture seule d'une carte (même rendu visuel que ProjectMosaicCard,
 * mais sans son propre <Link> — celui-ci est imbriqué dans le Link de la liste).
 */
function MosaicPreview({ item }: { item: HomeProject }) {
  const slots = item.mosaicTemplate ? MOSAIC_TEMPLATES[item.mosaicTemplate] : null;
  const coverUrl = item.mosaicSlots?.[0]?.url;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors group-hover:border-cyan-400/50">
      {slots ? (
        <div className="grid grid-cols-4 gap-2 sm:gap-3 p-2 sm:p-3">
          {slots.map((slot, i) => {
            const image = item.mosaicSlots?.[i];
            return (
              <div
                key={i}
                className={`relative overflow-hidden rounded-lg ${slot.span}`}
                style={{ aspectRatio: slot.aspect }}
              >
                {image?.url ? (
                  <Image src={image.url} alt="" fill sizes="(max-width: 640px) 100vw, 33vw" quality={85} className="object-cover" />
                ) : (
                  <PlaceholderMesh seed={`${item.id}-${i}`} className="h-full w-full" />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {coverUrl ? (
            <Image src={coverUrl} alt={item.title} fill sizes="(max-width: 640px) 100vw, 33vw" quality={85} className="object-cover" />
          ) : (
            <PlaceholderMesh seed={item.id} className="h-full w-full" />
          )}
        </div>
      )}
      <div className="px-4 py-3">
        {item.businessCategory && (
          <p className="text-[11px] uppercase tracking-widest text-cyan-300/80 mb-0.5">{item.businessCategory}</p>
        )}
        <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
      </div>
    </div>
  );
}

/**
 * Liste des projets home — CRUD complet (créer, configurer, publier,
 * supprimer). Entité indépendante du portfolio (PortfolioItem/featured).
 */
export default function MosaicPickerPage() {
  const router = useRouter();
  const [items, setItems] = useState<HomeProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const loadItems = () => {
    setIsLoading(true);
    getAllHomeProjects()
      .then(setItems)
      .catch(err => console.error('Error loading home projects:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const id = await addHomeProject({
        title: 'Nouveau projet',
        published: false,
        order: items.length,
      });
      router.push(`/admin/mosaic/${id}`);
    } catch (err) {
      console.error('Error creating home project:', err);
      setIsCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Supprimer ce projet de la home ?')) return;
    await deleteHomeProject(id);
    loadItems();
  };

  const handleTogglePublished = async (e: React.MouseEvent, item: HomeProject) => {
    e.preventDefault();
    e.stopPropagation();
    await updateHomeProject(item.id, { published: !item.published });
    loadItems();
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
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Projets de la home</h1>
                  <p className="text-sm text-white/40 mt-0.5">
                    Créez et configurez les cartes affichées dans « Nos réalisations »
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
                Nouveau projet
              </button>
            </div>

            {/* Bandeau d'aide */}
            <div className="flex items-start gap-2.5 mb-8 px-4 py-3 rounded-lg border border-indigo-500/20 bg-indigo-500/[0.07] text-sm text-white/60">
              <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p>
                Seuls les projets <strong className="text-white/80">publiés</strong> apparaissent sur la home.
                Utilisez le bouton œil sur chaque carte pour publier/dépublier.
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-xl text-white/30">
                <LayoutGrid className="w-10 h-10 mb-3" />
                <p className="text-sm">Aucun projet pour le moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => {
                  const isConfigured = !!item.mosaicTemplate;
                  return (
                    <Link key={item.id} href={`/admin/mosaic/${item.id}`} className="block relative group">
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleTogglePublished(e, item)}
                          title={item.published ? 'Publié — cliquer pour dépublier' : 'Brouillon — cliquer pour publier'}
                          className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${
                            item.published ? 'bg-indigo-500/80 text-white' : 'bg-black/50 text-white/50 border border-dashed border-white/20'
                          }`}
                        >
                          {item.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, item.id)}
                          title="Supprimer"
                          className="p-1.5 rounded-full bg-black/50 text-white/50 hover:text-red-400 backdrop-blur-sm transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {!isConfigured && (
                        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/50 text-white/50 border border-dashed border-white/20 backdrop-blur-sm">
                          Non configurée
                        </span>
                      )}
                      <MosaicPreview item={item} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Template>
    </AdminGuard>
  );
}
