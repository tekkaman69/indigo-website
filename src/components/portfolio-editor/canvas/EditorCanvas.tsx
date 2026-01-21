'use client';

import { Project, Section } from '@/types/portfolio-editor';
import { DraggableSection } from '../DraggableSection';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface EditorCanvasProps {
  project: Project;
  selectedSectionId: string | null;
  selectedBlockId: string | null;
  onSelectSection: (sectionId: string) => void;
  onSelectBlock: (blockId: string, sectionId: string) => void;
  onAddBlock: (sectionId: string) => void;
  onAddSection: () => void;
  onMoveSection: (fromIndex: number, toIndex: number) => void;
  onMoveBlockWithinSection: (sectionId: string, fromIndex: number, toIndex: number) => void;
  onMoveBlockBetweenSections: (fromSectionId: string, toSectionId: string, blockId: string, toIndex: number) => void;
}

export function EditorCanvas({
  project,
  selectedSectionId,
  selectedBlockId,
  onSelectSection,
  onSelectBlock,
  onAddBlock,
  onAddSection,
  onMoveSection,
  onMoveBlockWithinSection,
  onMoveBlockBetweenSections,
}: EditorCanvasProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    // Moving sections
    if (activeData?.type === 'section' && overData?.type === 'section') {
      const oldIndex = project.sections.findIndex((s) => s.id === active.id);
      const newIndex = project.sections.findIndex((s) => s.id === over.id);
      onMoveSection(oldIndex, newIndex);
    }

    // Moving blocks
    if (activeData?.type === 'block') {
      const fromSectionId = activeData.sectionId;
      const blockId = active.id as string;

      // Moving within same section
      if (overData?.type === 'block' && overData.sectionId === fromSectionId) {
        const section = project.sections.find((s) => s.id === fromSectionId);
        if (section) {
          const oldIndex = section.blocks.findIndex((b) => b.id === blockId);
          const newIndex = section.blocks.findIndex((b) => b.id === over.id);
          onMoveBlockWithinSection(fromSectionId, oldIndex, newIndex);
        }
      }
    }

    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => setActiveId(event.active.id as string)}
      onDragEnd={handleDragEnd}
    >
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="max-w-7xl mx-auto p-8">
        {/* Project header */}
        <div className="mb-8 pb-4 border-b border-border">
          <h2 className="text-2xl font-bold">
            {project.title || 'Untitled Project'}
          </h2>
          {project.description && (
            <p className="text-muted-foreground mt-1">{project.description}</p>
          )}
        </div>

        {/* Sections */}
        <SortableContext items={project.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4 pl-8">
            {project.sections.map((section, index) => (
              <DraggableSection
                key={section.id}
                section={section}
                isSelected={selectedSectionId === section.id}
                selectedBlockId={selectedBlockId}
                onSelectSection={() => onSelectSection(section.id)}
                onSelectBlock={(blockId) => onSelectBlock(blockId, section.id)}
                onAddBlock={() => onAddBlock(section.id)}
              />
            ))}
          </div>
        </SortableContext>

        {/* Add section button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddSection();
          }}
          className="w-full mt-8 p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <div className="text-center">
            <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Add new section</p>
          </div>
        </button>

        {/* Grid overlay helper */}
        <div className="fixed bottom-4 right-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div>
              <span className="font-semibold">{project.sections.length}</span> sections
            </div>
            <div>
              <span className="font-semibold">
                {project.sections.reduce((acc, s) => acc + s.blocks.length, 0)}
              </span>{' '}
              blocks
            </div>
          </div>
        </div>
      </div>
    </div>
    </DndContext>
  );
}
