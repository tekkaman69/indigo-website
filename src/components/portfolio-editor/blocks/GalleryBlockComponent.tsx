'use client';

import { GalleryBlock } from '@/types/portfolio-editor';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryBlockComponentProps {
  block: GalleryBlock;
  isSelected: boolean;
  onClick: () => void;
}

export function GalleryBlockComponent({ block, isSelected, onClick }: GalleryBlockComponentProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const aspectRatioClass = {
    'auto': 'aspect-auto',
    '1:1': 'aspect-square',
    '4:5': 'aspect-[4/5]',
    '16:9': 'aspect-video',
    '21:9': 'aspect-[21/9]',
    '3:4': 'aspect-[3/4]',
  }[block.ratio];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % block.images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + block.images.length) % block.images.length);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative overflow-hidden cursor-pointer transition-all duration-200',
        isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
      style={{
        borderRadius: `${block.borderRadius}px`,
        padding: `${block.padding}px`,
        background: block.background,
        boxShadow: block.shadow,
      }}
    >
      {block.images.length > 0 ? (
        <>
          {block.displayMode === 'grid' && (
            <div
              className="grid w-full"
              style={{
                gridTemplateColumns: `repeat(${block.columns || 3}, 1fr)`,
                gap: `${block.gap}px`,
              }}
            >
              {block.images.map((image) => (
                <div key={image.id}>
                  <div className={cn('relative w-full', block.ratio === 'auto' ? 'min-h-[300px]' : aspectRatioClass)}>
                    <img
                      src={image.src}
                      alt={image.alt || ''}
                      className={cn(
                        'absolute inset-0 w-full h-full object-cover',
                        block.hoverEffect && 'hover:scale-105 transition-transform duration-300'
                      )}
                    />
                  </div>
                  {image.caption && (
                    <div className="mt-1 text-xs text-muted-foreground text-center">
                      {image.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {block.displayMode === 'masonry' && (
            <div
              className="columns-3 gap-4 w-full"
              style={{
                columnGap: `${block.gap}px`,
              }}
            >
              {block.images.map((image) => (
                <div key={image.id} className="mb-4 break-inside-avoid">
                  <img
                    src={image.src}
                    alt={image.alt || ''}
                    className={cn(
                      'w-full h-auto object-cover',
                      block.hoverEffect && 'hover:scale-105 transition-transform duration-300'
                    )}
                  />
                  {image.caption && (
                    <div className="mt-1 text-sm text-muted-foreground">{image.caption}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {block.displayMode === 'slider' && (
            <div className="relative w-full">
              <div className={cn('relative w-full', block.ratio === 'auto' ? 'min-h-[400px]' : aspectRatioClass)}>
                <img
                  src={block.images[currentSlide].src}
                  alt={block.images[currentSlide].alt || ''}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {block.images[currentSlide].caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-2 backdrop-blur-sm">
                    {block.images[currentSlide].caption}
                  </div>
                )}
              </div>

              {block.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {block.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSlide(idx);
                        }}
                        className={cn(
                          'w-2 h-2 rounded-full transition-all',
                          idx === currentSlide
                            ? 'bg-white w-4'
                            : 'bg-white/50 hover:bg-white/70'
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center w-full min-h-[300px] bg-muted text-muted-foreground">
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
            <p className="text-sm">No images in gallery</p>
          </div>
        </div>
      )}
    </div>
  );
}
