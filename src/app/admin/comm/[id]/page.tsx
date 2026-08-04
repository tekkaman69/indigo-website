'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminGuard } from '@/components/admin/AdminGuard';
import Template from '@/app/template';
import { getCommProjectById, updateCommProject } from '@/lib/firebase/firestore';
import { uploadImage, generateUniqueFileName } from '@/lib/firebase/storage';
import { readImageRatio, readImageRatioFromUrl } from '@/lib/image-ratio';
import { useToast } from '@/hooks/use-toast';
import type { CommProject, CommImage } from '@/types/firebase';
import CommProjectCard from '@/components/showcase/CommProjectCard';
import MediaLibraryModal, { type LibraryImage } from '@/components/admin/shared/MediaLibraryModal';
import { ChevronLeft, Loader2, Save, ImagePlus, LibraryBig, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

// Image en cours d'édition : soit déjà hébergée (url distante), soit un fichier
// en attente d'upload (blob url d'aperçu + File conservé).
interface DraftImage extends CommImage {
  pendingFile?: File;
}

export default function CommEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [draft, setDraft] = useState<CommProject | null>(null);
  const [images, setImages] = useState<DraftImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const blobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    getCommProjectById(id)
      .then(project => {
        if (!project) {
          toast({ title: 'Projet introuvable', variant: 'destructive' });
          router.replace('/admin/comm');
          return;
        }
        setDraft(project);
        setImages(project.images ?? []);
      })
      .catch(err => {
        console.error('Error loading comm project:', err);
        toast({ title: 'Erreur de chargement', variant: 'destructive' });
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // Ajout d'un ou plusieurs fichiers — ratio lu immédiatement pour le masonry.
  const handleFilesAdded = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const added: DraftImage[] = [];
    for (const file of Array.from(files)) {
      const blobUrl = URL.createObjectURL(file);
      blobUrlsRef.current.push(blobUrl);
      const ratio = await readImageRatio(file);
      added.push({ url: blobUrl, ratio, pendingFile: file });
    }
    setImages(prev => [...prev, ...added]);
  };

  const handlePickFromLibrary = async (image: LibraryImage) => {
    const ratio = await readImageRatioFromUrl(image.url);
    setImages(prev => [...prev, { url: image.url, ratio }]);
    setLibraryOpen(false);
  };

  const handleRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, dir: -1 | 1) => {
    setImages(prev => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleAltChange = (index: number, alt: string) => {
    setImages(prev => prev.map((img, i) => (i === index ? { ...img, alt } : img)));
  };

  const handleSave = async () => {
    if (!draft) return;
    if (!draft.title.trim()) {
      toast({ title: 'Titre requis', description: 'Donnez un titre au projet.', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      // Construit une CommImage SANS clés undefined — Firestore rejette les
      // valeurs undefined, y compris à l'intérieur des objets d'un tableau.
      const cleanImage = (data: { url: string; path?: string; ratio?: number; alt?: string }): CommImage => {
        const out: CommImage = { url: data.url };
        if (data.path) out.path = data.path;
        if (typeof data.ratio === 'number') out.ratio = data.ratio;
        if (data.alt && data.alt.trim()) out.alt = data.alt.trim();
        return out;
      };

      // Upload des fichiers en attente, puis assemblage des CommImage finales.
      const finalImages: CommImage[] = [];
      for (const img of images) {
        if (img.pendingFile) {
          const path = `comm/${generateUniqueFileName(img.pendingFile.name)}`;
          const url = await uploadImage(img.pendingFile, path);
          finalImages.push(cleanImage({ url, path, ratio: img.ratio, alt: img.alt }));
        } else {
          finalImages.push(cleanImage({ url: img.url, path: img.path, ratio: img.ratio, alt: img.alt }));
        }
      }

      await updateCommProject(draft.id, {
        title: draft.title.trim(),
        description: draft.description,
        supportType: draft.supportType,
        images: finalImages,
        published: draft.published,
      });

      toast({ title: 'Projet enregistré', description: 'Les changements sont visibles sur la home.' });
      router.push('/admin/comm');
    } catch (err) {
      console.error('Error saving comm project:', err);
      const message = err instanceof Error ? err.message : String(err);
      const isPermission = /permission|insufficient|PERMISSION_DENIED/i.test(message);
      toast({
        title: 'Erreur',
        description: isPermission
          ? "Écriture refusée par Firestore. Publiez les règles de sécurité (collection comm_projects) dans la console Firebase."
          : `L'enregistrement a échoué : ${message}`,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminGuard>
        <Template>
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          </div>
        </Template>
      </AdminGuard>
    );
  }

  if (!draft) return null;

  // Aperçu live : injecte les images en cours dans une copie du projet.
  const previewProject: CommProject = { ...draft, images };

  return (
    <AdminGuard>
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-12 text-white">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/admin/comm" className="text-white/40 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{draft.title || 'Projet de communication'}</h1>
                <p className="text-sm text-white/40 mt-0.5">
                  Contexte du projet et visuels affichés en mosaïque sur la home
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Colonne gauche — contrôles */}
              <div className="lg:col-span-5 space-y-6">
                {/* Méta */}
                <div className="space-y-1.5">
                  <label htmlFor="comm-title" className="text-sm font-medium text-white/80">Titre</label>
                  <input
                    id="comm-title"
                    type="text"
                    value={draft.title}
                    onChange={(e) => setDraft(prev => (prev ? { ...prev, title: e.target.value } : prev))}
                    disabled={isSaving}
                    placeholder="Ex : Affiche — Journée portes ouvertes"
                    className="w-full h-10 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="comm-support" className="text-sm font-medium text-white/80">Type de support (optionnel)</label>
                  <input
                    id="comm-support"
                    type="text"
                    value={draft.supportType ?? ''}
                    onChange={(e) => setDraft(prev => (prev ? { ...prev, supportType: e.target.value } : prev))}
                    disabled={isSaving}
                    placeholder="Affiche, Brochure, Signalétique…"
                    className="w-full h-10 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="comm-desc" className="text-sm font-medium text-white/80">Contexte / brief (optionnel)</label>
                  <textarea
                    id="comm-desc"
                    value={draft.description ?? ''}
                    onChange={(e) => setDraft(prev => (prev ? { ...prev, description: e.target.value } : prev))}
                    disabled={isSaving}
                    rows={3}
                    placeholder="En une ou deux phrases : l'objectif, la cible, la contrainte…"
                    className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.published}
                    onChange={(e) => setDraft(prev => (prev ? { ...prev, published: e.target.checked } : prev))}
                    disabled={isSaving}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-white/80">Publié (visible sur la home)</span>
                </label>

                {/* Import d'images */}
                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-white/80">Visuels ({images.length})</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-white/20 hover:bg-white/5 text-white/70 text-sm cursor-pointer transition-colors">
                      <ImagePlus className="w-4 h-4" />
                      Ajouter des images
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={isSaving}
                        onChange={(e) => { handleFilesAdded(e.target.files); e.target.value = ''; }}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setLibraryOpen(true)}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-white/15 hover:bg-white/5 text-white/60 hover:text-white text-sm transition-colors"
                    >
                      <LibraryBig className="w-4 h-4" />
                      Bibliothèque
                    </button>
                  </div>

                  {/* Liste réordonnable */}
                  <div className="space-y-2">
                    {images.map((img, i) => (
                      <div key={`${img.url}-${i}`} className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] p-2">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <input
                          type="text"
                          value={img.alt ?? ''}
                          onChange={(e) => handleAltChange(i, e.target.value)}
                          placeholder={`Légende visuel ${i + 1} (optionnel)`}
                          disabled={isSaving}
                          className="flex-1 min-w-0 h-8 rounded-md border border-white/10 bg-white/[0.03] px-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button type="button" onClick={() => handleMove(i, -1)} disabled={i === 0 || isSaving} title="Monter" className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-colors">
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => handleMove(i, 1)} disabled={i === images.length - 1 || isSaving} title="Descendre" className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-colors">
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => handleRemove(i)} disabled={isSaving} title="Retirer" className="p-1.5 rounded-md text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {images.length === 0 && (
                      <p className="text-xs text-white/30 text-center py-4 border border-dashed border-white/10 rounded-lg">
                        Aucun visuel — ajoutez-en pour composer la mosaïque.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium transition-colors"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <Link
                    href="/admin/comm"
                    className="px-5 py-2.5 rounded-lg border border-white/15 hover:bg-white/5 text-white/70 hover:text-white text-sm font-medium transition-colors"
                  >
                    Annuler
                  </Link>
                </div>
              </div>

              {/* Colonne droite — aperçu live */}
              <div className="lg:col-span-7">
                <div className="sticky top-6">
                  <p className="text-xs uppercase tracking-widest text-white/30 mb-3">
                    Aperçu en temps réel — identique à la home
                  </p>
                  <div className="max-w-md mx-auto lg:mx-0">
                    <CommProjectCard project={previewProject} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <MediaLibraryModal
          open={libraryOpen}
          onOpenChange={setLibraryOpen}
          onSelect={handlePickFromLibrary}
        />
      </Template>
    </AdminGuard>
  );
}
