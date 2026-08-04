'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminGuard } from '@/components/admin/AdminGuard';
import Template from '@/app/template';
import Image from 'next/image';
import { getAllCommProjects, addCommProject, deleteCommProject, updateCommProject } from '@/lib/firebase/firestore';
import type { CommProject } from '@/types/firebase';
import PlaceholderMesh from '@/components/showcase/PlaceholderMesh';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Loader2, Info, LayoutGrid, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

/** Aperçu en lecture seule d'un projet — 1re image + méta. */
function CommProjectPreview({ project }: { project: CommProject }) {
  const cover = project.images?.find(img => img?.url);
  const count = project.images?.filter(img => img?.url).length ?? 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors group-hover:border-cyan-400/50">
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-white/5">
        {cover?.url ? (
          <Image src={cover.url} alt={project.title} fill sizes="(max-width: 640px) 100vw, 33vw" quality={80} className="object-cover" />
        ) : (
          <PlaceholderMesh seed={project.id} className="h-full w-full" />
        )}
      </div>
      <div className="px-4 py-3">
        <p className="text-[11px] uppercase tracking-widest text-cyan-300/80 mb-0.5">
          {project.supportType || 'Support'} · {count} visuel{count > 1 ? 's' : ''}
        </p>
        <h3 className="text-sm font-semibold text-white truncate">{project.title || 'Sans titre'}</h3>
      </div>
    </div>
  );
}

/**
 * Liste des projets de communication institutionnelle — CRUD complet.
 * Entité indépendante de home_projects / insta_feeds.
 */
export default function CommPickerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects] = useState<CommProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const loadProjects = () => {
    setIsLoading(true);
    getAllCommProjects()
      .then(setProjects)
      .catch(err => console.error('Error loading comm projects:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const id = await addCommProject({
        title: '',
        images: [],
        published: false,
        order: projects.length,
      });
      router.push(`/admin/comm/${id}`);
    } catch (err) {
      console.error('Error creating comm project:', err);
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Impossible de créer le projet.',
        variant: 'destructive',
      });
      setIsCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Supprimer ce projet ?')) return;
    await deleteCommProject(id);
    loadProjects();
  };

  const handleTogglePublished = async (e: React.MouseEvent, project: CommProject) => {
    e.preventDefault();
    e.stopPropagation();
    await updateCommProject(project.id, { published: !project.published });
    loadProjects();
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
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Communication institutionnelle</h1>
                  <p className="text-sm text-white/40 mt-0.5">
                    Supports de com (affiches, brochures…) affichés en mosaïque sur la home
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
                Chaque projet affiche ses visuels en mosaïque flexible (ratios conservés). Seuls les
                projets <strong className="text-white/80">publiés</strong> apparaissent sur la home.
                Utilisez le bouton œil pour publier/dépublier.
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-xl text-white/30">
                <LayoutGrid className="w-10 h-10 mb-3" />
                <p className="text-sm">Aucun projet pour le moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                  <Link key={project.id} href={`/admin/comm/${project.id}`} className="block relative group">
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleTogglePublished(e, project)}
                        title={project.published ? 'Publié — cliquer pour dépublier' : 'Brouillon — cliquer pour publier'}
                        className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${
                          project.published ? 'bg-indigo-500/80 text-white' : 'bg-black/50 text-white/50 border border-dashed border-white/20'
                        }`}
                      >
                        {project.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, project.id)}
                        title="Supprimer"
                        className="p-1.5 rounded-full bg-black/50 text-white/50 hover:text-red-400 backdrop-blur-sm transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <CommProjectPreview project={project} />
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
