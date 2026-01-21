'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadAsset } from '@/lib/firebase/assets';
import { AssetPicker } from './AssetPicker';
import { Asset } from '@/types/asset';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CoverModuleProps {
  projectId: string;
  coverImage: string;
  coverPosition?: string;
  onUpdate: (updates: { coverImage?: string; coverPosition?: string }) => void;
}

export function CoverModule({ projectId, coverImage, coverPosition = 'center', onUpdate }: CoverModuleProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [assetPickerOpen, setAssetPickerOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadAsset(file);
      if (result.wasReused) {
        console.log('[COVER] Asset was reused (deduplicated)');
      }
      onUpdate({ coverImage: result.asset.url });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePositionChange = (value: string) => {
    onUpdate({ coverPosition: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Cover Image</h3>

      {coverImage && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border bg-muted">
          <img
            src={coverImage}
            alt="Cover preview"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: coverPosition || 'center' }}
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setAssetPickerOpen(true)}
          className="flex-1"
          disabled={isUploading}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Browse Images
        </Button>

        <Label htmlFor="cover-upload" className="cursor-pointer flex-1">
          <div className="flex items-center justify-center gap-2 w-full h-full px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors">
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload New</span>
              </>
            )}
          </div>
        </Label>
        <input
          id="cover-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
      </div>

      <AssetPicker
        open={assetPickerOpen}
        onOpenChange={setAssetPickerOpen}
        onSelect={(asset: Asset) => {
          onUpdate({ coverImage: asset.url });
        }}
        type="image"
      />

      {coverImage && (
        <div>
          <Label htmlFor="cover-position">Position</Label>
          <Select value={coverPosition || 'center'} onValueChange={handlePositionChange}>
            <SelectTrigger id="cover-position">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[200]">
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
              <SelectItem value="top left">Top Left</SelectItem>
              <SelectItem value="top right">Top Right</SelectItem>
              <SelectItem value="bottom left">Bottom Left</SelectItem>
              <SelectItem value="bottom right">Bottom Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
