'use client';

import { VideoBlock } from '@/types/portfolio-editor';
import { cn } from '@/lib/utils';

interface VideoBlockComponentProps {
  block: VideoBlock;
  isSelected: boolean;
  onClick: () => void;
}

export function VideoBlockComponent({ block, isSelected, onClick }: VideoBlockComponentProps) {
  const aspectRatioClass = {
    'auto': 'aspect-auto',
    '1:1': 'aspect-square',
    '4:5': 'aspect-[4/5]',
    '16:9': 'aspect-video',
    '21:9': 'aspect-[21/9]',
    '3:4': 'aspect-[3/4]',
  }[block.ratio];

  const getEmbedUrl = (src: string, source: string) => {
    if (source === 'youtube') {
      const videoId = src.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (source === 'vimeo') {
      const videoId = src.match(/vimeo\.com\/(?:.*\/)?(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    return src;
  };

  const embedUrl = getEmbedUrl(block.src, block.source);

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative overflow-hidden cursor-pointer transition-all duration-200',
        block.ratio === 'auto' ? 'min-h-[400px]' : aspectRatioClass,
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
          {block.source === 'upload' ? (
            <video
              src={embedUrl || ''}
              poster={block.poster}
              autoPlay={block.autoplay}
              loop={block.loop}
              muted={block.muted}
              controls={block.controls}
              className={cn(
                'w-full h-full object-cover',
                block.hoverEffect && 'hover:scale-105 transition-transform duration-300'
              )}
            />
          ) : (
            <iframe
              src={embedUrl || ''}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
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
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm">No video selected</p>
          </div>
        </div>
      )}
    </div>
  );
}
