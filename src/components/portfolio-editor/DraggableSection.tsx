'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Section } from '@/types/portfolio-editor';
import { SectionComponent } from './SectionComponent';
import { GripVertical } from 'lucide-react';

interface DraggableSectionProps {
  section: Section;
  isSelected: boolean;
  selectedBlockId: string | null;
  onSelectSection: () => void;
  onSelectBlock: (blockId: string) => void;
  onAddBlock: () => void;
}

export function DraggableSection({
  section,
  isSelected,
  selectedBlockId,
  onSelectSection,
  onSelectBlock,
  onAddBlock,
}: DraggableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({
    id: section.id,
    data: {
      type: 'section',
      section,
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
      style={style}
      className="relative group"
      {...attributes}
    >
      {/* Drag handle - always visible and functional */}
      <div
        ref={setActivatorNodeRef}
        {...listeners}
        className="absolute -left-8 top-2 opacity-40 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-20 bg-background/80 rounded"
      >
        <button className="p-1" title="Drag section">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <SectionComponent
        section={section}
        isSelected={isSelected}
        selectedBlockId={selectedBlockId}
        onSelectSection={onSelectSection}
        onSelectBlock={onSelectBlock}
        onAddBlock={onAddBlock}
      />
    </div>
  );
}
