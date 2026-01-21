'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Trash2 } from 'lucide-react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { AdminGuard } from '@/components/admin/AdminGuard';

interface ResetResult {
  total: number;
  updated: number;
  errors: string[];
}

export default function ResetTagsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ResetResult | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    console.log(message);
  };

  const resetAllTags = async () => {
    if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer tous les tags de tous les projets ?\n\nCette action est irréversible.')) {
      return;
    }

    setIsRunning(true);
    setResult(null);
    setLog([]);

    const result: ResetResult = {
      total: 0,
      updated: 0,
      errors: [],
    };

    try {
      addLog('🚀 Démarrage de la réinitialisation des tags...');

      // Get all portfolio items
      const portfolioRef = collection(db, 'portfolio');
      const snapshot = await getDocs(portfolioRef);
      result.total = snapshot.docs.length;
      addLog(`📊 Trouvé ${result.total} projet(s) dans la base de données`);

      // Reset tags for each project
      for (const docSnapshot of snapshot.docs) {
        try {
          const data = docSnapshot.data();
          const projectTitle = data.title || docSnapshot.id;

          addLog(`\n📄 Traitement: ${projectTitle}`);

          // Always update to ensure tags is empty array, regardless of current state
          addLog(`  🏷️  Tags actuels: ${JSON.stringify(data.tags || [])}`);

          // Update project with empty tags array
          const docRef = doc(db, 'portfolio', docSnapshot.id);
          await updateDoc(docRef, { tags: [] });

          addLog(`  ✅ Tags remplacés par []`);
          result.updated++;

        } catch (error) {
          const errorMsg = `Erreur sur ${docSnapshot.id}: ${(error as Error).message}`;
          addLog(`  ❌ ${errorMsg}`);
          result.errors.push(errorMsg);
        }
      }

      addLog('\n✨ Réinitialisation terminée!');
      addLog(`📊 Total projets: ${result.total}`);
      addLog(`✅ Mis à jour: ${result.updated}`);
      addLog(`❌ Erreurs: ${result.errors.length}`);

      setResult(result);

    } catch (error) {
      addLog(`\n💥 Erreur fatale: ${(error as Error).message}`);
      result.errors.push((error as Error).message);
      setResult(result);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <AdminGuard>
      <div className="container mx-auto p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Réinitialiser les Tags</h1>
          <p className="text-muted-foreground mt-2">
            Supprime tous les tags de tous les projets pour repartir sur une base propre.
          </p>
        </div>

        {result && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Résultats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Projets</p>
                <p className="text-2xl font-bold">{result.total}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mis à jour</p>
                <p className="text-2xl font-bold text-green-600">{result.updated}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Erreurs</p>
                <p className="text-2xl font-bold text-red-600">{result.errors.length}</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-red-600 mb-2">Erreurs:</p>
                <ul className="text-xs text-red-600 space-y-1">
                  {result.errors.map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        <Button
          onClick={resetAllTags}
          disabled={isRunning}
          size="lg"
          variant="destructive"
          className="w-full mb-6"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Réinitialisation en cours...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer tous les tags
            </>
          )}
        </Button>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Journal</h3>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-xs overflow-auto max-h-96">
            {log.length === 0 ? (
              <p className="text-gray-500">Aucune action effectuée. Cliquez sur le bouton pour commencer.</p>
            ) : (
              log.map((line, i) => (
                <div key={i}>{line}</div>
              ))
            )}
          </div>
        </Card>

        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">⚠️ Attention</h3>
          <ul className="text-sm text-red-800 dark:text-red-300 space-y-1">
            <li>• Cette action supprime TOUS les tags de TOUS les projets</li>
            <li>• Cette action est IRRÉVERSIBLE</li>
            <li>• Vous devrez réattribuer les tags manuellement depuis l'éditeur</li>
            <li>• Les nouveaux tags utilisent le système de checkboxes prédéfinies</li>
          </ul>
        </div>
      </div>
    </AdminGuard>
  );
}
