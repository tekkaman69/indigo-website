'use client';

import { useState } from 'react';

export default function TestImagePage() {
  const [url, setUrl] = useState('');
  const [testUrl] = useState('https://firebasestorage.googleapis.com/v0/b/indigo-website-dde24.firebasestorage.app/o/portfolio%2F1737561678584-abc123.jpg?alt=media');

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      <h1 className="text-2xl font-bold">Test Rendu Image</h1>

      <div className="space-y-4">
        <h2 className="text-xl">1. Test avec URL Firebase exemple</h2>
        <div className="relative w-full aspect-video border-2 border-green-500">
          <img
            src={testUrl}
            alt="Test"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <p className="text-sm text-green-600">Si cette image s affiche, Firebase fonctionne</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl">2. Test avec votre URL</h2>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Collez l URL Firebase ici"
          className="w-full p-2 border rounded text-foreground bg-background"
        />
        {url && (
          <div className="relative w-full aspect-video border-2 border-blue-500">
            <img
              src={url}
              alt="Votre test"
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={() => console.log('✅ Image loaded:', url)}
              onError={() => console.error('❌ Image failed:', url)}
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl">3. Infos</h2>
        <div className="bg-muted p-4 rounded text-xs space-y-2">
          <p><strong>Test URL:</strong> {testUrl}</p>
          <p><strong>Votre URL:</strong> {url || '(vide)'}</p>
          <hr className="my-2" />
          <p>Si l image 1 fonctionne mais pas la 2:</p>
          <ul className="list-disc pl-4">
            <li>Vérifiez que votre URL commence par https://</li>
            <li>Vérifiez Firebase Storage Rules</li>
            <li>Vérifiez que le fichier existe</li>
          </ul>
          <hr className="my-2" />
          <p>Si aucune image ne fonctionne:</p>
          <ul className="list-disc pl-4">
            <li>Problème de CORS ou Firebase config</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
