'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from '@/types/portfolio-editor';
import { BlockRenderer } from './blocks/BlockRenderer';
import { GripVertical } from 'lucide-react';

interface DraggableBlockProps {
  block: Block;
  sectionId: string;
  isSelected: boolean;
  onSelectBlock: () => void;
}

export function DraggableBlock({
  block,
  sectionId,
  isSelected,
  onSelectBlock,
}: DraggableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({
    id: block.id,
    data: {
      type: 'block',
      block,
      sectionId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        gridColumn: block.type === 'gallery' || block.type === 'video' ? '1 / -1' : undefined,
      }}
      className="relative group/block min-w-0"
      {...attributes}
    >
      {/* Drag handle - always visible and functional */}
      <div
        ref={setActivatorNodeRef}
        {...listeners}
        className="absolute -left-6 top-2 opacity-40 group-hover/block:opacity-100 transition-opacity z-10 cursor-grab active:cursor-grabbing bg-background/80 rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="p-1" title="Drag block">
          <GripVertical className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>

      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelectBlock();
        }}
      >
        <BlockRenderer
          block={block}
          isSelected={isSelected}
          onClick={onSelectBlock}
        />
      </div>
    </div>
  );
}
