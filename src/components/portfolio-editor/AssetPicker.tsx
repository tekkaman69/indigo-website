'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Asset } from '@/types/asset';
import { getAllAssets, uploadAsset, deleteAsset } from '@/lib/firebase/assets';
import { Upload, Trash2, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: Asset | Asset[]) => void;
  type?: 'image' | 'video';
  multiSelect?: boolean;
}

export function AssetPicker({ open, onOpenChange, onSelect, type = 'image', multiSelect = false }: AssetPickerProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      loadAssets();
    }
  }, [open]);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      console.log('[ASSET_PICKER] Loading assets...');
      const allAssets = await getAllAssets();
      console.log('[ASSET_PICKER] Loaded assets:', allAssets.length);
      const filtered = allAssets.filter(a => a.type === type);
      console.log('[ASSET_PICKER] Filtered assets:', filtered.length);
      setAssets(filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (error) {
      console.error('[ASSET_PICKER] Failed to load assets:', error);
      alert('Failed to load assets: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadAsset(file);

      if (result.wasReused) {
        console.log('Asset was reused, not uploaded again');
      }

      await loadAssets();

      // Auto-select the uploaded/reused asset
      setSelectedAssetId(result.asset.id);
    } catch (error) {
      console.error('Failed to upload asset:', error);
      alert('Failed to upload asset. Please try again.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (assetId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    if (asset.usedIn.length > 0) {
      alert(`Cannot delete: This asset is used in ${asset.usedIn.length} project(s)`);
      return;
    }

    if (!confirm('Delete this asset permanently?')) return;

    try {
      await deleteAsset(assetId);
      await loadAssets();
    } catch (error) {
      console.error('Failed to delete asset:', error);
      alert('Failed to delete asset. Please try again.');
    }
  };

  const handleToggleAsset = (assetId: string) => {
    if (multiSelect) {
      const newSelection = new Set(selectedAssetIds);
      if (newSelection.has(assetId)) {
        newSelection.delete(assetId);
      } else {
        newSelection.add(assetId);
      }
      setSelectedAssetIds(newSelection);
    } else {
      setSelectedAssetIds(new Set([assetId]));
    }
  };

  const handleSelectAsset = () => {
    if (multiSelect) {
      const selectedAssets = assets.filter(a => selectedAssetIds.has(a.id));
      if (selectedAssets.length > 0) {
        onSelect(selectedAssets);
        onOpenChange(false);
        setSelectedAssetIds(new Set());
      }
    } else {
      const assetId = Array.from(selectedAssetIds)[0];
      const asset = assets.find(a => a.id === assetId);
      if (asset) {
        onSelect(asset);
        onOpenChange(false);
        setSelectedAssetIds(new Set());
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col z-[9999]">
        <DialogHeader>
          <DialogTitle>Select {type === 'image' ? 'Image' : 'Video'}</DialogTitle>
        </DialogHeader>

        {/* Upload button */}
        <div className="flex gap-2">
          <Input
            id="asset-upload"
            type="file"
            accept={type === 'image' ? 'image/*' : 'video/*'}
            onChange={handleUpload}
            disabled={isUploading}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('asset-upload')?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload New {type === 'image' ? 'Image' : 'Video'}
              </>
            )}
          </Button>
        </div>

        {/* Assets grid */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : assets.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <p>No {type}s uploaded yet</p>
                <p className="text-sm mt-2">Upload your first {type} to get started</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 p-4">
              {assets.map((asset) => {
                const isSelected = selectedAssetIds.has(asset.id);
                return (
                <div
                  key={asset.id}
                  onClick={() => handleToggleAsset(asset.id)}
                  className={cn(
                    'relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all',
                    isSelected
                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  {/* Image preview */}
                  <div className="aspect-video bg-muted relative">
                    {type === 'image' ? (
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

                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}

                    {/* Delete button (only for unused assets) */}
                    {asset.usedIn.length === 0 && (
                      <button
                        onClick={(e) => handleDelete(asset.id, e)}
                        className="absolute top-2 left-2 bg-destructive text-destructive-foreground rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Usage indicator */}
                    {asset.usedIn.length > 0 && (
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        Used in {asset.usedIn.length} project{asset.usedIn.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {/* Asset info */}
                  <div className="p-2 bg-background">
                    <p className="text-xs font-medium truncate" title={asset.fileName}>
                      {asset.fileName}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(asset.size)}
                      </p>
                      {asset.width && asset.height && (
                        <p className="text-xs text-muted-foreground">
                          {asset.width} × {asset.height}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSelectAsset}
            disabled={selectedAssetIds.size === 0}
          >
            Use Selected {multiSelect && selectedAssetIds.size > 1 ? `(${selectedAssetIds.size})` : type === 'image' ? 'Image' : 'Video'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
