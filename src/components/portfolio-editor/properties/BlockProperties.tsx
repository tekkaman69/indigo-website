'use client';

import { Block, ImageBlock, VideoBlock, GalleryBlock, TextBlock, BlockType } from '@/types/portfolio-editor';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { uploadImage, generateUniqueFileName } from '@/lib/firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { ImagePositionControl } from '../ImagePositionControl';
import { AssetPicker } from '../AssetPicker';
import { Asset } from '@/types/asset';
import { uploadAsset } from '@/lib/firebase/assets';

interface BlockPropertiesProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  onChangeType?: (newType: BlockType) => void;
}

export function BlockProperties({ block, onUpdate, onDelete, onChangeType }: BlockPropertiesProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [assetPickerOpen, setAssetPickerOpen] = useState(false);
  const [galleryAssetPickerOpen, setGalleryAssetPickerOpen] = useState(false);

  const handleImageUpload = async (file: File, path: string = 'portfolio') => {
    try {
      setUploading(true);
      console.log('[UPLOAD] Starting upload:', { fileName: file.name, size: file.size });

      // Use asset manager for deduplication
      const result = await uploadAsset(file);

      if (result.wasReused) {
        console.log('[UPLOAD] Asset was reused (deduplicated)');
        toast({
          title: 'Image reused',
          description: 'This image was already uploaded',
        });
      } else {
        console.log('[UPLOAD] New asset uploaded');
      }

      console.log('[UPLOAD] Got asset URL:', result.asset.url);
      return result.asset.url;
    } catch (error) {
      console.error('[UPLOAD] Upload failed:', error);
      toast({
        title: 'Upload failed',
        description: 'Could not upload image',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Common properties
  const CommonProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="ratio">Aspect Ratio</Label>
        <Select
          value={block.ratio}
          onValueChange={(value) => onUpdate({ ratio: value as any })}
        >
          <SelectTrigger id="ratio">
            <SelectValue placeholder="Select ratio" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[200]">
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="1:1">1:1 (Square)</SelectItem>
            <SelectItem value="4:5">4:5 (Portrait)</SelectItem>
            <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
            <SelectItem value="21:9">21:9 (Ultra-wide)</SelectItem>
            <SelectItem value="3:4">3:4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="borderRadius">Border Radius (px)</Label>
        <Input
          id="borderRadius"
          type="number"
          value={block.borderRadius}
          onChange={(e) => onUpdate({ borderRadius: parseInt(e.target.value) || 0 })}
          min={0}
          max={50}
        />
      </div>

      <div>
        <Label htmlFor="padding">Padding (px)</Label>
        <Input
          id="padding"
          type="number"
          value={block.padding}
          onChange={(e) => onUpdate({ padding: parseInt(e.target.value) || 0 })}
          min={0}
          max={50}
        />
      </div>

      <div>
        <Label htmlFor="background">Background</Label>
        <Input
          id="background"
          type="text"
          value={block.background || ''}
          onChange={(e) => onUpdate({ background: e.target.value })}
          placeholder="e.g. #000000 or transparent"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="hoverEffect"
          type="checkbox"
          checked={block.hoverEffect || false}
          onChange={(e) => onUpdate({ hoverEffect: e.target.checked })}
          className="w-4 h-4"
        />
        <Label htmlFor="hoverEffect" className="cursor-pointer">
          Hover Effect
        </Label>
      </div>
    </div>
  );

  // Image Block Properties
  if (block.type === 'image') {
    const imageBlock = block as ImageBlock;
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Image Block</h3>
          <p className="text-sm text-muted-foreground mt-1">Configure image display</p>
        </div>

        {onChangeType && (
          <div>
            <Label htmlFor="blockType">Block Type</Label>
            <Select value={block.type} onValueChange={(value) => onChangeType(value as BlockType)}>
              <SelectTrigger id="blockType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[200]">
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="gallery">Gallery</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="imageSrc">Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="imageSrc"
                type="text"
                value={imageBlock.src}
                onChange={(e) => onUpdate({ src: e.target.value })}
                placeholder="https://..."
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => setAssetPickerOpen(true)}
                title="Browse existing images"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const url = await handleImageUpload(file);
                      console.log('[BLOCK_UPDATE] Updating block src:', url);
                      onUpdate({ src: url });
                    }
                  };
                  input.click();
                }}
                disabled={uploading}
                title="Upload new image"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <AssetPicker
            open={assetPickerOpen}
            onOpenChange={setAssetPickerOpen}
            onSelect={(asset: Asset) => {
              console.log('[BLOCK_UPDATE] Using asset:', asset.url);
              onUpdate({ src: asset.url });
            }}
            type="image"
          />

          <div>
            <Label htmlFor="alt">Alt Text</Label>
            <Input
              id="alt"
              value={imageBlock.alt || ''}
              onChange={(e) => onUpdate({ alt: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              value={imageBlock.caption || ''}
              onChange={(e) => onUpdate({ caption: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="objectFit">Object Fit</Label>
            <Select
              value={imageBlock.objectFit}
              onValueChange={(value) => onUpdate({ objectFit: value as any })}
            >
              <SelectTrigger id="objectFit">
                <SelectValue placeholder="Select fit" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[200]">
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="contain">Contain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {imageBlock.src && (
            <ImagePositionControl
              src={imageBlock.src}
              objectFit={imageBlock.objectFit}
              ratio={imageBlock.ratio}
              position={imageBlock.position}
              onPositionChange={(position) => onUpdate({ position })}
            />
          )}

          <div className="flex items-center gap-2">
            <input
              id="lightbox"
              type="checkbox"
              checked={imageBlock.lightbox}
              onChange={(e) => onUpdate({ lightbox: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="lightbox" className="cursor-pointer">
              Enable Lightbox
            </Label>
          </div>
        </div>

        <CommonProperties />

        <Button variant="destructive" size="sm" onClick={onDelete} className="w-full">
          <Trash2 className="w-4 h-4 mr-1" />
          Delete Block
        </Button>
      </div>
    );
  }

  // Video Block Properties
  if (block.type === 'video') {
    const videoBlock = block as VideoBlock;
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Video Block</h3>
          <p className="text-sm text-muted-foreground mt-1">Configure video playback</p>
        </div>

        {onChangeType && (
          <div>
            <Label htmlFor="blockType">Block Type</Label>
            <Select value={block.type} onValueChange={(value) => onChangeType(value as BlockType)}>
              <SelectTrigger id="blockType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[200]">
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="gallery">Gallery</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="videoSource">Video Source</Label>
            <Select
              value={videoBlock.source}
              onValueChange={(value) => onUpdate({ source: value as any })}
            >
              <SelectTrigger id="videoSource">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[200]">
                <SelectItem value="upload">Upload</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="vimeo">Vimeo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="videoSrc">Video URL</Label>
            <Input
              id="videoSrc"
              value={videoBlock.src}
              onChange={(e) => onUpdate({ src: e.target.value })}
              placeholder={
                videoBlock.source === 'youtube'
                  ? 'https://youtube.com/watch?v=...'
                  : videoBlock.source === 'vimeo'
                  ? 'https://vimeo.com/...'
                  : 'https://...'
              }
            />
          </div>

          {videoBlock.source === 'upload' && (
            <>
              <div>
                <Label htmlFor="poster">Poster Image</Label>
                <Input
                  id="poster"
                  value={videoBlock.poster || ''}
                  onChange={(e) => onUpdate({ poster: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    id="autoplay"
                    type="checkbox"
                    checked={videoBlock.autoplay}
                    onChange={(e) => onUpdate({ autoplay: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="autoplay" className="cursor-pointer">
                    Autoplay
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="loop"
                    type="checkbox"
                    checked={videoBlock.loop}
                    onChange={(e) => onUpdate({ loop: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="loop" className="cursor-pointer">
                    Loop
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="muted"
                    type="checkbox"
                    checked={videoBlock.muted}
                    onChange={(e) => onUpdate({ muted: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="muted" className="cursor-pointer">
                    Muted
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="controls"
                    type="checkbox"
                    checked={videoBlock.controls}
                    onChange={(e) => onUpdate({ controls: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="controls" className="cursor-pointer">
                    Show Controls
                  </Label>
                </div>
              </div>
            </>
          )}
        </div>

        <CommonProperties />

        <Button variant="destructive" size="sm" onClick={onDelete} className="w-full">
          <Trash2 className="w-4 h-4 mr-1" />
          Delete Block
        </Button>
      </div>
    );
  }

  // Gallery Block Properties
  if (block.type === 'gallery') {
    const galleryBlock = block as GalleryBlock;
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Gallery Block</h3>
          <p className="text-sm text-muted-foreground mt-1">Manage gallery images</p>
        </div>

        {onChangeType && (
          <div>
            <Label htmlFor="blockType">Block Type</Label>
            <Select value={block.type} onValueChange={(value) => onChangeType(value as BlockType)}>
              <SelectTrigger id="blockType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[200]">
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="gallery">Gallery</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="displayMode">Display Mode</Label>
            <Select
              value={galleryBlock.displayMode}
              onValueChange={(value) => onUpdate({ displayMode: value as any })}
            >
              <SelectTrigger id="displayMode">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[200]">
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="masonry">Masonry</SelectItem>
                <SelectItem value="slider">Slider</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {galleryBlock.displayMode === 'grid' && (
            <div>
              <Label htmlFor="columns">Columns</Label>
              <Input
                id="columns"
                type="number"
                value={galleryBlock.columns || 3}
                onChange={(e) => onUpdate({ columns: parseInt(e.target.value) || 3 })}
                min={1}
                max={6}
              />
            </div>
          )}

          <div>
            <Label htmlFor="galleryGap">Gap (px)</Label>
            <Input
              id="galleryGap"
              type="number"
              value={galleryBlock.gap}
              onChange={(e) => onUpdate({ gap: parseInt(e.target.value) || 0 })}
              min={0}
              max={50}
            />
          </div>

          <div>
            <Label>Images ({galleryBlock.images.length})</Label>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setGalleryAssetPickerOpen(true)}
              >
                <ImageIcon className="w-4 h-4 mr-1" />
                Browse
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.multiple = true;
                  input.onchange = async (e) => {
                    const files = Array.from((e.target as HTMLInputElement).files || []);
                    const newImages = await Promise.all(
                      files.map(async (file) => {
                        const url = await handleImageUpload(file);
                        return {
                          id: crypto.randomUUID(),
                          src: url,
                          alt: file.name,
                          caption: '',
                        };
                      })
                    );
                    onUpdate({ images: [...galleryBlock.images, ...newImages] });
                  };
                  input.click();
                }}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-1" />
                Upload
              </Button>
            </div>

            <AssetPicker
              open={galleryAssetPickerOpen}
              onOpenChange={setGalleryAssetPickerOpen}
              onSelect={(assets: Asset | Asset[]) => {
                const assetArray = Array.isArray(assets) ? assets : [assets];
                const newImages = assetArray.map(asset => ({
                  id: crypto.randomUUID(),
                  src: asset.url,
                  alt: asset.fileName,
                  caption: '',
                }));
                onUpdate({ images: [...galleryBlock.images, ...newImages] });
              }}
              type="image"
              multiSelect={true}
            />
            <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
              {galleryBlock.images.map((img, index) => (
                <div key={img.id} className="flex items-center gap-2 p-2 border border-border rounded">
                  <img src={img.src} alt={img.alt || ''} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1 text-xs truncate">{img.alt || 'Image'}</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      onUpdate({ images: galleryBlock.images.filter((image) => image.id !== img.id) });
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <CommonProperties />

        <Button variant="destructive" size="sm" onClick={onDelete} className="w-full">
          <Trash2 className="w-4 h-4 mr-1" />
          Delete Block
        </Button>
      </div>
    );
  }

  // Text Block Properties
  if (block.type === 'text') {
    const textBlock = block as TextBlock;
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Text Block</h3>
          <p className="text-sm text-muted-foreground mt-1">Edit text content</p>
        </div>

        {onChangeType && (
          <div>
            <Label htmlFor="blockType">Block Type</Label>
            <Select value={block.type} onValueChange={(value) => onChangeType(value as BlockType)}>
              <SelectTrigger id="blockType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[200]">
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="gallery">Gallery</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="content">Content (HTML)</Label>
            <Textarea
              id="content"
              value={textBlock.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              rows={6}
              placeholder="<p>Your text here...</p>"
            />
          </div>

          <div>
            <Label htmlFor="textAlign">Text Align</Label>
            <Select
              value={textBlock.textAlign}
              onValueChange={(value) => onUpdate({ textAlign: value as any })}
            >
              <SelectTrigger id="textAlign">
                <SelectValue placeholder="Select alignment" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[200]">
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="fontSize">Font Size (px)</Label>
            <Input
              id="fontSize"
              type="number"
              value={textBlock.fontSize || 16}
              onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) || 16 })}
              min={12}
              max={72}
            />
          </div>

          <div>
            <Label htmlFor="lineHeight">Line Height</Label>
            <Input
              id="lineHeight"
              type="number"
              step="0.1"
              value={textBlock.lineHeight || 1.5}
              onChange={(e) => onUpdate({ lineHeight: parseFloat(e.target.value) || 1.5 })}
              min={1}
              max={3}
            />
          </div>
        </div>

        <CommonProperties />

        <Button variant="destructive" size="sm" onClick={onDelete} className="w-full">
          <Trash2 className="w-4 h-4 mr-1" />
          Delete Block
        </Button>
      </div>
    );
  }

  return null;
}
