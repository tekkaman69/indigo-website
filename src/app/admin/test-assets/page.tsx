'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function TestAssetsPage() {
  const [result, setResult] = useState<string>('Not tested');
  const [loading, setLoading] = useState(false);

  const testFetch = async () => {
    setLoading(true);
    setResult('Testing...');

    try {
      // Test 1: Check if Firebase is initialized
      const { db } = await import('@/lib/firebase/config');
      console.log('[TEST] Firebase db:', db ? 'initialized' : 'NOT initialized');

      if (!db) {
        setResult('❌ Firebase db is NOT initialized');
        return;
      }

      // Test 2: Fetch assets
      const { collection, getDocs } = await import('firebase/firestore');
      const assetsRef = collection(db, 'assets');
      console.log('[TEST] Assets collection ref:', assetsRef);

      const snapshot = await getDocs(assetsRef);
      console.log('[TEST] Snapshot size:', snapshot.size);
      console.log('[TEST] Snapshot empty:', snapshot.empty);

      if (snapshot.empty) {
        setResult('✅ Firestore connected but collection is empty (0 documents)');
        return;
      }

      // Test 3: Map documents
      const assets = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('[TEST] Document:', doc.id, data);
        return {
          id: doc.id,
          url: data.url,
          type: data.type,
          fileName: data.fileName,
        };
      });

      console.log('[TEST] Mapped assets:', assets);
      setResult(`✅ Found ${assets.length} asset(s):\n${JSON.stringify(assets, null, 2)}`);

    } catch (error) {
      console.error('[TEST] Error:', error);
      setResult(`❌ Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Test Assets Fetch</h1>

      <Button onClick={testFetch} disabled={loading}>
        {loading ? 'Testing...' : 'Test Fetch Assets'}
      </Button>

      <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-96">
        {result}
      </pre>

      <div className="text-sm text-muted-foreground">
        <p>Open Console (F12) to see detailed logs</p>
      </div>
    </div>
  );
}
