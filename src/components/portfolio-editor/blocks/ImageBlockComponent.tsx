'use client';

import { ImageBlock } from '@/types/portfolio-editor';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ImageBlockComponentProps {
  block: ImageBlock;
  isSelected: boolean;
  onClick: () => void;
}

export function ImageBlockComponent({ block, isSelected, onClick }: ImageBlockComponentProps) {
  const [showLightbox, setShowLightbox] = useState(false);

  const aspectRatioClass = {
    'auto': 'aspect-auto',
    '1:1': 'aspect-square',
    '4:5': 'aspect-[4/5]',
    '16:9': 'aspect-video',
    '21:9': 'aspect-[21/9]',
    '3:4': 'aspect-[3/4]',
  }[block.ratio];

  return (
    <>
      <div
        onClick={onClick}
        className={cn(
          'relative overflow-hidden cursor-pointer transition-all duration-200 w-full',
          isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
        )}
        style={{
          borderRadius: `${block.borderRadius}px`,
          padding: `${block.padding}px`,
          background: block.background,
          boxShadow: block.shadow,
        }}
      >
        {block.src ? (
          <>
            <div className={cn('relative w-full', block.ratio === 'auto' ? 'min-h-[400px]' : aspectRatioClass)}>
              <img
                src={block.src}
                alt={block.alt || ''}
                className={cn(
                  'absolute inset-0 w-full h-full transition-opacity duration-200',
                  block.hoverEffect && 'hover:scale-105 transition-transform duration-300'
                )}
                style={{
                  objectFit: block.objectFit || 'cover',
                  objectPosition: block.position ? `${block.position.x}% ${block.position.y}%` : 'center',
                }}
                onClick={(e) => {
                  if (block.lightbox) {
                    e.stopPropagation();
                    setShowLightbox(true);
                  }
                }}
              />
            </div>
            {block.caption && (
              <div className="mt-2 text-sm text-muted-foreground text-center">
                {block.caption}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full min-h-[300px] bg-muted text-muted-foreground">
            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm">No image selected</p>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && block.src && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <div className="relative max-w-7xl max-h-full">
            <img
              src={block.src}
              alt={block.alt || ''}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {block.caption && (
              <div className="mt-4 text-white text-center">{block.caption}</div>
            )}
          </div>
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
