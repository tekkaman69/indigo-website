'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminGuard } from '@/components/admin/AdminGuard';
import Template from '@/app/template';
import { getInstaFeedById, updateInstaFeed } from '@/lib/firebase/firestore';
import { uploadImage, generateUniqueFileName } from '@/lib/firebase/storage';
import { useToast } from '@/hooks/use-toast';
import type { InstaFeed } from '@/types/firebase';
import { FEED_SLOT_COUNT } from '@/types/firebase';
import InstaFeedCard from '@/components/showcase/InstaFeedCard';
import InstaFeedMetaFields from './InstaFeedMetaFields';
import MosaicSlotUploader from '@/app/admin/mosaic/[id]/MosaicSlotUploader';
import MediaLibraryModal, { type LibraryImage } from '@/components/admin/shared/MediaLibraryModal';
import { ChevronLeft, Loader2, Save } from 'lucide-react';

/** Toutes les cases d'un feed Instagram sont au format 4:5. */
const FEED_SLOT_ASPECT = '4/5';

export default function InstaFeedEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [draft, setDraft] = useState<InstaFeed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<Record<number, File>>({});
  const blobUrlsRef = useRef<string[]>([]);
  const [libraryTargetSlot, setLibraryTargetSlot] = useState<number | null>(null);

  useEffect(() => {
    getInstaFeedById(id)
      .then(feed => {
        if (!feed) {
          toast({ title: 'Feed introuvable', variant: 'destructive' });
          router.replace('/admin/feeds');
          return;
        }
        // Normalise toujours à 9 slots pour l'édition
        const slots = Array.from({ length: FEED_SLOT_COUNT }, (_, i) => feed.slots?.[i] ?? { url: '' });
        setDraft({ ...feed, slots });
      })
      .catch(err => {
        console.error('Error loading insta feed:', err);
        toast({ title: 'Erreur de chargement', variant: 'destructive' });
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Révoque les blob URLs créées à la fermeture de la page (évite les fuites mémoire)
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleSlotFile = (index: number, file: File) => {
    const blobUrl = URL.createObjectURL(file);
    blobUrlsRef.current.push(blobUrl);
    setPendingFiles(prev => ({ ...prev, [index]: file }));
    setDraft(prev => {
      if (!prev) return prev;
      const slots = [...prev.slots];
      slots[index] = { url: blobUrl };
      return { ...prev, slots };
    });
  };

  const handleFocalPointChange = (index: number, focalPoint: { x: number; y: number }) => {
    setDraft(prev => {
      if (!prev) return prev;
      const slots = [...prev.slots];
      slots[index] = { ...slots[index], focalPoint };
      return { ...prev, slots };
    });
  };

  const handleZoomChange = (index: number, zoom: number) => {
    setDraft(prev => {
      if (!prev) return prev;
      const slots = [...prev.slots];
      slots[index] = { ...slots[index], zoom };
      return { ...prev, slots };
    });
  };

  const handlePickFromLibrary = (image: LibraryImage) => {
    if (libraryTargetSlot === null) return;
    const index = libraryTargetSlot;
    // Image déjà hébergée : URL réelle directe, aucun upload nécessaire.
    setPendingFiles(prev => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
    setDraft(prev => {
      if (!prev) return prev;
      const slots = [...prev.slots];
      slots[index] = { url: image.url };
      return { ...prev, slots };
    });
    setLibraryTargetSlot(null);
  };

  const handleSave = async () => {
    if (!draft) return;
    setIsSaving(true);
    try {
      // Upload des fichiers en attente, remplacement des blob URLs par les vraies URLs Storage
      const finalSlots = [...draft.slots];
      for (const [indexStr, file] of Object.entries(pendingFiles)) {
        const index = Number(indexStr);
        const path = `feeds/${generateUniqueFileName(file.name)}`;
        const url = await uploadImage(file, path);
        finalSlots[index] = { ...finalSlots[index], url };
      }

      await updateInstaFeed(draft.id, {
        clientName: draft.clientName,
        caption: draft.caption,
        slots: finalSlots,
        published: draft.published,
      });

      toast({ title: 'Feed enregistré', description: 'Les changements sont visibles sur la home.' });
      router.push('/admin/feeds');
    } catch (err) {
      console.error('Error saving insta feed:', err);
      toast({ title: 'Erreur', description: "L'enregistrement a échoué", variant: 'destructive' });
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

  return (
    <AdminGuard>
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-12 text-white">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/admin/feeds" className="text-white/40 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{draft.clientName || 'Feed Instagram'}</h1>
                <p className="text-sm text-white/40 mt-0.5">
                  Nom du client et 9 visuels (format 4:5) de la mosaïque affichée sur la home
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Colonne gauche — contrôles */}
              <div className="lg:col-span-5 space-y-6">
                <InstaFeedMetaFields
                  clientName={draft.clientName ?? ''}
                  caption={draft.caption ?? ''}
                  published={draft.published}
                  onClientNameChange={(clientName) => setDraft(prev => (prev ? { ...prev, clientName } : prev))}
                  onCaptionChange={(caption) => setDraft(prev => (prev ? { ...prev, caption } : prev))}
                  onPublishedChange={(published) => setDraft(prev => (prev ? { ...prev, published } : prev))}
                  disabled={isSaving}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Visuels du feed (9 · format 4:5)
                  </label>
                  {draft.slots.map((slot, i) => (
                    <MosaicSlotUploader
                      key={i}
                      index={i}
                      url={slot?.url ?? ''}
                      aspect={FEED_SLOT_ASPECT}
                      focalPoint={slot?.focalPoint}
                      zoom={slot?.zoom}
                      onFileSelected={(file) => handleSlotFile(i, file)}
                      onPickFromLibrary={() => setLibraryTargetSlot(i)}
                      onFocalPointChange={(fp) => handleFocalPointChange(i, fp)}
                      onZoomChange={(z) => handleZoomChange(i, z)}
                      disabled={isSaving}
                    />
                  ))}
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
                    href="/admin/feeds"
                    className="px-5 py-2.5 rounded-lg border border-white/15 hover:bg-white/5 text-white/70 hover:text-white text-sm font-medium transition-colors"
                  >
                    Annuler
                  </Link>
                </div>
              </div>

              {/* Colonne droite — aperçu live, identique au rendu de production */}
              <div className="lg:col-span-7">
                <div className="sticky top-6">
                  <p className="text-xs uppercase tracking-widest text-white/30 mb-3">
                    Aperçu en temps réel — identique à la home
                  </p>
                  <div className="max-w-sm mx-auto lg:mx-0">
                    <InstaFeedCard feed={draft} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <MediaLibraryModal
          open={libraryTargetSlot !== null}
          onOpenChange={(open) => { if (!open) setLibraryTargetSlot(null); }}
          onSelect={handlePickFromLibrary}
        />
      </Template>
    </AdminGuard>
  );
}
