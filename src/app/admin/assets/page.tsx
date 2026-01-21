'use client';

import { useState, useEffect } from 'react';
import { Asset } from '@/types/asset';
import { getAllAssets, getUnusedAssets, deleteAsset } from '@/lib/firebase/assets';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [unusedAssets, setUnusedAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unused'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const [all, unused] = await Promise.all([
        getAllAssets(),
        getUnusedAssets(),
      ]);

      setAssets(all.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      setUnusedAssets(unused);
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleDelete = async (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    if (asset.usedIn.length > 0) {
      alert(`Cannot delete: This asset is used in ${asset.usedIn.length} project(s)`);
      return;
    }

    if (!confirm('Delete this asset permanently from Firebase Storage?')) return;

    setDeleting(assetId);
    try {
      await deleteAsset(assetId);
      await loadAssets();
    } catch (error) {
      console.error('Failed to delete asset:', error);
      alert('Failed to delete asset. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAllUnused = async () => {
    if (unusedAssets.length === 0) {
      alert('No unused assets to delete');
      return;
    }

    if (!confirm(`Delete ${unusedAssets.length} unused asset(s) permanently?`)) return;

    setIsLoading(true);
    try {
      await Promise.all(unusedAssets.map(asset => deleteAsset(asset.id)));
      await loadAssets();
      alert(`Successfully deleted ${unusedAssets.length} unused asset(s)`);
    } catch (error) {
      console.error('Failed to delete assets:', error);
      alert('Failed to delete some assets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const displayedAssets = filter === 'unused' ? unusedAssets : assets;
  const totalSize = displayedAssets.reduce((sum, asset) => sum + asset.size, 0);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Asset Manager</h1>
        <p className="text-muted-foreground mt-2">
          Manage uploaded images and videos. Duplicate files are automatically deduplicated.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Assets</p>
          <p className="text-2xl font-bold">{assets.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Unused Assets</p>
          <p className="text-2xl font-bold">{unusedAssets.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Storage</p>
          <p className="text-2xl font-bold">{formatFileSize(totalSize)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Images</p>
          <p className="text-2xl font-bold">{assets.filter(a => a.type === 'image').length}</p>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Assets ({assets.length})
        </Button>
        <Button
          variant={filter === 'unused' ? 'default' : 'outline'}
          onClick={() => setFilter('unused')}
        >
          Unused Only ({unusedAssets.length})
        </Button>
        <div className="flex-1" />
        <Button
          variant="outline"
          onClick={loadAssets}
          disabled={isLoading}
        >
          <RefreshCw className={cn('w-4 h-4 mr-2', isLoading && 'animate-spin')} />
          Refresh
        </Button>
        {unusedAssets.length > 0 && (
          <Button
            variant="destructive"
            onClick={handleDeleteAllUnused}
            disabled={isLoading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All Unused ({unusedAssets.length})
          </Button>
        )}
      </div>

      {/* Assets Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : displayedAssets.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <p>No assets found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedAssets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden group">
              {/* Preview */}
              <div className="aspect-video bg-muted relative">
                {asset.type === 'image' ? (
                  <img
                    src={asset.url}
                    alt={asset.fileName}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={asset.url}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => window.open(asset.url, '_blank')}
                  >
                    View
                  </Button>
                  {asset.usedIn.length === 0 && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(asset.id)}
                      disabled={deleting === asset.id}
                    >
                      {deleting === asset.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>

                {/* Usage badge */}
                {asset.usedIn.length > 0 && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    {asset.usedIn.length} project{asset.usedIn.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 space-y-1">
                <p className="text-sm font-medium truncate" title={asset.fileName}>
                  {asset.fileName}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatFileSize(asset.size)}</span>
                  {asset.width && asset.height && (
                    <span>{asset.width} × {asset.height}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(asset.createdAt)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
