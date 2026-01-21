'use client';

import { TextBlock } from '@/types/portfolio-editor';
import { cn } from '@/lib/utils';

interface TextBlockComponentProps {
  block: TextBlock;
  isSelected: boolean;
  onClick: () => void;
}

export function TextBlockComponent({ block, isSelected, onClick }: TextBlockComponentProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative cursor-pointer transition-all duration-200 w-full min-w-0 overflow-hidden',
        isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
      style={{
        borderRadius: `${block.borderRadius}px`,
        padding: `${block.padding}px`,
        background: block.background,
        boxShadow: block.shadow,
        textAlign: block.textAlign,
        fontSize: block.fontSize ? `${block.fontSize}px` : undefined,
        lineHeight: block.lineHeight,
      }}
    >
      {block.content ? (
        <div
          className={cn(
            'prose prose-invert max-w-full break-words',
            block.hoverEffect && 'hover:opacity-80 transition-opacity duration-300'
          )}
          style={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            width: '100%',
          }}
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      ) : (
        <div className="flex items-center justify-center w-full min-h-[200px] bg-muted text-muted-foreground">
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <p className="text-sm">Empty text block</p>
          </div>
        </div>
      )}
    </div>
  );
}
