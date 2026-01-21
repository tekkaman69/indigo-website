'use client';

import { Section } from '@/types/portfolio-editor';
import { DraggableBlock } from './DraggableBlock';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';

interface SectionComponentProps {
  section: Section;
  isSelected: boolean;
  selectedBlockId: string | null;
  onSelectSection: () => void;
  onSelectBlock: (blockId: string) => void;
  onAddBlock: () => void;
}

/**
 * Section Component - controls layout and grid
 * Blocks never define their own width
 */
export function SectionComponent({
  section,
  isSelected,
  selectedBlockId,
  onSelectSection,
  onSelectBlock,
}: SectionComponentProps) {
  const verticalAlignClass = {
    top: 'items-start',
    center: 'items-center',
    stretch: 'items-stretch',
  }[section.verticalAlign];

  return (
    <div
      className={cn(
        'relative transition-all duration-200',
        isSelected && 'ring-2 ring-primary ring-offset-4 ring-offset-background'
      )}
      style={{
        marginTop: `${section.marginTop}px`,
        marginBottom: `${section.marginBottom}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelectSection();
      }}
    >
      {/* Section grid */}
      <SortableContext items={section.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div
          className={cn('grid w-full', verticalAlignClass)}
          style={{
            gridTemplateColumns: `repeat(${section.columns}, 1fr)`,
            gap: `${section.gap}px`,
          }}
        >
          {section.blocks.length === 0 ? (
            Array.from({ length: section.columns }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="border-2 border-dashed border-muted-foreground/20 rounded-lg min-h-[200px] flex items-center justify-center bg-muted/5"
              >
                <p className="text-xs text-muted-foreground/50">Empty slot</p>
              </div>
            ))
          ) : (
            section.blocks.map((block) => (
              <DraggableBlock
                key={block.id}
                block={block}
                sectionId={section.id}
                isSelected={selectedBlockId === block.id}
                onSelectBlock={() => onSelectBlock(block.id)}
              />
            ))
          )}
        </div>
      </SortableContext>

      {/* Section info overlay */}
      {isSelected && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl">
          {section.columns} column{section.columns > 1 ? 's' : ''} • {section.blocks.length} block
          {section.blocks.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
