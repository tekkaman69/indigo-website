'use client';

import { Section, Block, BlockType } from '@/types/portfolio-editor';
import { SectionProperties } from './SectionProperties';
import { BlockProperties } from './BlockProperties';
import { Settings2 } from 'lucide-react';

interface PropertiesPanelProps {
  selectedSection: Section | null;
  selectedBlock: Block | null;
  canMoveSectionUp: boolean;
  canMoveSectionDown: boolean;
  onUpdateSection: (updates: Partial<Section>) => void;
  onUpdateBlock: (updates: Partial<Block>) => void;
  onDeleteSection: () => void;
  onDeleteBlock: () => void;
  onMoveSectionUp: () => void;
  onMoveSectionDown: () => void;
  onChangeBlockType?: (newType: BlockType) => void;
}

export function PropertiesPanel({
  selectedSection,
  selectedBlock,
  canMoveSectionUp,
  canMoveSectionDown,
  onUpdateSection,
  onUpdateBlock,
  onDeleteSection,
  onDeleteBlock,
  onMoveSectionUp,
  onMoveSectionDown,
  onChangeBlockType,
}: PropertiesPanelProps) {
  return (
    <div className="w-80 h-full bg-background border-l border-border overflow-y-auto p-6">
      {selectedBlock ? (
        <BlockProperties
          block={selectedBlock}
          onUpdate={onUpdateBlock}
          onDelete={onDeleteBlock}
          onChangeType={onChangeBlockType}
        />
      ) : selectedSection ? (
        <SectionProperties
          section={selectedSection}
          canMoveUp={canMoveSectionUp}
          canMoveDown={canMoveSectionDown}
          onUpdate={onUpdateSection}
          onDelete={onDeleteSection}
          onMoveUp={onMoveSectionUp}
          onMoveDown={onMoveSectionDown}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <Settings2 className="w-12 h-12 mb-4 opacity-50" />
          <h3 className="font-semibold mb-2">No Selection</h3>
          <p className="text-sm">
            Select a section or block to edit its properties
          </p>
        </div>
      )}
    </div>
  );
}
