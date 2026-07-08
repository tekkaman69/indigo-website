'use client';

import { useState } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import Template from '@/app/template';
import { getPortfolioItems, addHomeProject } from '@/lib/firebase/firestore';
import { Loader2 } from 'lucide-react';

/**
 * Script de migration jetable : copie les PortfolioItem `featured===true`
 * vers la nouvelle collection home_projects. À exécuter une seule fois,
 * puis à supprimer (ce fichier n'a pas vocation à rester dans le projet).
 */
export default function MigrateHomeProjectsPage() {
  const [log, setLog] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [done, setDone] = useState(false);

  const runMigration = async () => {
    setIsRunning(true);
    setLog([]);
    try {
      const all = await getPortfolioItems();
      const featured = all.filter(p => p.featured === true);
      setLog(prev => [...prev, `${featured.length} projet(s) featured trouvé(s)`]);

      let order = 0;
      for (const p of featured) {
        const id = await addHomeProject({
          title: p.title,
          businessCategory: p.businessCategory,
          mosaicTemplate: p.mosaicTemplate,
          mosaicSlots: p.mosaicSlots,
          linkedPortfolioId: p.id,
          published: true,
          order: order++,
        });
        setLog(prev => [...prev, `✓ "${p.title}" migré → home_projects/${id}`]);
      }
      setLog(prev => [...prev, 'Migration terminée.']);
      setDone(true);
    } catch (err) {
      setLog(prev => [...prev, `Erreur : ${err instanceof Error ? err.message : String(err)}`]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <AdminGuard>
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-16 text-white max-w-2xl">
          <h1 className="text-2xl font-bold mb-2">Migration — home_projects</h1>
          <p className="text-sm text-white/50 mb-6">
            Copie les projets portfolio "En vedette" vers la nouvelle collection home_projects.
            À exécuter une seule fois, puis supprimer cette page.
          </p>

          <button
            type="button"
            onClick={runMigration}
            disabled={isRunning || done}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {isRunning && <Loader2 className="w-4 h-4 animate-spin" />}
            {done ? 'Migration effectuée' : 'Lancer la migration'}
          </button>

          {log.length > 0 && (
            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-1 text-sm text-white/70 font-mono">
              {log.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}
        </div>
      </Template>
    </AdminGuard>
  );
}
