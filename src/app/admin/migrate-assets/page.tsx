'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { collection, doc, setDoc, getDocs, Timestamp } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase/config';

interface MigrationResult {
  total: number;
  migrated: number;
  skipped: number;
  errors: string[];
}

export default function MigrateAssetsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    console.log(message);
  };

  const migrateAssets = async () => {
    setIsRunning(true);
    setResult(null);
    setLog([]);

    const result: MigrationResult = {
      total: 0,
      migrated: 0,
      skipped: 0,
      errors: [],
    };

    try {
      addLog('🚀 Starting migration...');

      // Check existing assets to avoid duplicates
      const assetsRef = collection(db, 'assets');
      const existingSnapshot = await getDocs(assetsRef);
      const existingUrls = new Set(existingSnapshot.docs.map(doc => doc.data().url));
      addLog(`📦 Found ${existingUrls.size} existing assets in collection`);

      // Function to recursively list all files
      const getAllFiles = async (folderRef: any): Promise<any[]> => {
        const listResult = await listAll(folderRef);
        let allFiles = [...listResult.items];

        // Recursively scan subfolders
        for (const prefixRef of listResult.prefixes) {
          addLog(`📂 Scanning subfolder: ${prefixRef.fullPath}`);
          const subFiles = await getAllFiles(prefixRef);
          allFiles = [...allFiles, ...subFiles];
        }

        return allFiles;
      };

      // List all files in Storage /portfolio folder recursively
      const portfolioRef = ref(storage, 'portfolio');
      addLog('📂 Scanning Storage folder: portfolio/ (recursive)');

      const allFiles = await getAllFiles(portfolioRef);
      result.total = allFiles.length;
      addLog(`📊 Found ${result.total} files in Storage (including subfolders)`);

      // Process each file
      for (const itemRef of allFiles) {
        try {
          addLog(`\n📄 Processing: ${itemRef.fullPath}`);

          // Get file metadata and URL
          const [metadata, url] = await Promise.all([
            getMetadata(itemRef),
            getDownloadURL(itemRef),
          ]);

          // Check if already exists
          if (existingUrls.has(url)) {
            addLog(`  ⏭️  Already exists, skipping`);
            result.skipped++;
            continue;
          }

          // Create asset document
          const assetId = crypto.randomUUID();
          const asset = {
            id: assetId,
            url,
            path: itemRef.fullPath,
            type: metadata.contentType?.startsWith('image/') ? 'image' : 'video',
            size: metadata.size,
            hash: `legacy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Fake hash for legacy files
            fileName: itemRef.name,
            mimeType: metadata.contentType || 'image/jpeg',
            createdAt: Timestamp.fromDate(new Date(metadata.timeCreated)),
            usedIn: [], // Empty initially, will be populated when used
          };

          // Save to Firestore
          await setDoc(doc(db, 'assets', assetId), asset);

          addLog(`  ✅ Migrated: ${itemRef.name}`);
          result.migrated++;

        } catch (error) {
          const errorMsg = `Error processing ${itemRef.name}: ${(error as Error).message}`;
          addLog(`  ❌ ${errorMsg}`);
          result.errors.push(errorMsg);
        }
      }

      addLog('\n✨ Migration complete!');
      addLog(`📊 Total files: ${result.total}`);
      addLog(`✅ Migrated: ${result.migrated}`);
      addLog(`⏭️  Skipped: ${result.skipped}`);
      addLog(`❌ Errors: ${result.errors.length}`);

      setResult(result);

    } catch (error) {
      addLog(`\n💥 Fatal error: ${(error as Error).message}`);
      result.errors.push((error as Error).message);
      setResult(result);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Migrate Existing Assets</h1>
        <p className="text-muted-foreground mt-2">
          This tool will scan your Firebase Storage and create asset records for existing files.
        </p>
      </div>

      {result && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Migration Results</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Files</p>
              <p className="text-2xl font-bold">{result.total}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Migrated</p>
              <p className="text-2xl font-bold text-green-600">{result.migrated}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Skipped</p>
              <p className="text-2xl font-bold text-yellow-600">{result.skipped}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Errors</p>
              <p className="text-2xl font-bold text-red-600">{result.errors.length}</p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-red-600 mb-2">Errors:</p>
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
        onClick={migrateAssets}
        disabled={isRunning}
        size="lg"
        className="w-full mb-6"
      >
        {isRunning ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Migrating...
          </>
        ) : (
          'Start Migration'
        )}
      </Button>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Migration Log</h3>
        <div className="bg-black text-green-400 p-4 rounded font-mono text-xs overflow-auto max-h-96">
          {log.length === 0 ? (
            <p className="text-gray-500">No logs yet. Click "Start Migration" to begin.</p>
          ) : (
            log.map((line, i) => (
              <div key={i}>{line}</div>
            ))
          )}
        </div>
      </Card>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">⚠️ Important Notes</h3>
        <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
          <li>• This will scan the <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">portfolio/</code> folder in Firebase Storage</li>
          <li>• Files already in the assets collection will be skipped</li>
          <li>• This is safe to run multiple times</li>
          <li>• After migration, images will appear in the Asset Picker</li>
        </ul>
      </div>
    </div>
  );
}
