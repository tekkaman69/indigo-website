'use client';

import { Block } from '@/types/portfolio-editor';
import { ImageBlockComponent } from './ImageBlockComponent';
import { VideoBlockComponent } from './VideoBlockComponent';
import { GalleryBlockComponent } from './GalleryBlockComponent';
import { TextBlockComponent } from './TextBlockComponent';

interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * Block Renderer - delegates to appropriate block component
 */
export function BlockRenderer({ block, isSelected, onClick }: BlockRendererProps) {
  switch (block.type) {
    case 'image':
      return <ImageBlockComponent block={block} isSelected={isSelected} onClick={onClick} />;
    case 'video':
      return <VideoBlockComponent block={block} isSelected={isSelected} onClick={onClick} />;
    case 'gallery':
      return <GalleryBlockComponent block={block} isSelected={isSelected} onClick={onClick} />;
    case 'text':
      return <TextBlockComponent block={block} isSelected={isSelected} onClick={onClick} />;
    default:
      return null;
  }
}
