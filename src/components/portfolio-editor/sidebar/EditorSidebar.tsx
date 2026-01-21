'use client';

import { Plus, Layout, Image as ImageIcon, Video, Grid3x3, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BlockType } from '@/types/portfolio-editor';
import { useState } from 'react';

interface EditorSidebarProps {
  onAddSection: (columns: 1 | 2 | 3 | 4) => void;
  onSelectBlockType: (type: BlockType) => void;
  selectedSectionId: string | null;
}

export function EditorSidebar({
  onAddSection,
  onSelectBlockType,
  selectedSectionId,
}: EditorSidebarProps) {
  const [columns, setColumns] = useState<1 | 2 | 3 | 4>(1);

  const sectionLayouts: Array<{ columns: 1 | 2 | 3 | 4; label: string; icon: JSX.Element }> = [
    {
      columns: 1,
      label: '1 Column',
      icon: (
        <div className="flex gap-1">
          <div className="w-full h-8 bg-primary/20 rounded"></div>
        </div>
      ),
    },
    {
      columns: 2,
      label: '2 Columns',
      icon: (
        <div className="flex gap-1">
          <div className="w-full h-8 bg-primary/20 rounded"></div>
          <div className="w-full h-8 bg-primary/20 rounded"></div>
        </div>
      ),
    },
    {
      columns: 3,
      label: '3 Columns',
      icon: (
        <div className="flex gap-1">
          <div className="w-full h-8 bg-primary/20 rounded"></div>
          <div className="w-full h-8 bg-primary/20 rounded"></div>
          <div className="w-full h-8 bg-primary/20 rounded"></div>
        </div>
      ),
    },
    {
      columns: 4,
      label: '4 Columns',
      icon: (
        <div className="flex gap-1">
          <div className="w-full h-6 bg-primary/20 rounded"></div>
          <div className="w-full h-6 bg-primary/20 rounded"></div>
          <div className="w-full h-6 bg-primary/20 rounded"></div>
          <div className="w-full h-6 bg-primary/20 rounded"></div>
        </div>
      ),
    },
  ];

  const blockTypes: Array<{ type: BlockType; label: string; icon: JSX.Element; description: string }> = [
    {
      type: 'image',
      label: 'Image',
      icon: <ImageIcon className="w-5 h-5" />,
      description: 'Single image with caption',
    },
    {
      type: 'video',
      label: 'Video',
      icon: <Video className="w-5 h-5" />,
      description: 'Upload or embed video',
    },
    {
      type: 'gallery',
      label: 'Gallery',
      icon: <Grid3x3 className="w-5 h-5" />,
      description: 'Multiple images in grid/slider',
    },
    {
      type: 'text',
      label: 'Text',
      icon: <Type className="w-5 h-5" />,
      description: 'Rich text content',
    },
  ];

  return (
    <div className="w-80 h-full bg-background border-r border-border overflow-y-auto p-6 space-y-6">
      {/* Add Section */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Layout className="w-4 h-4" />
          Add Section
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="w-16 h-16 text-2xl font-bold"
              onClick={() => {
                const nextColumns = (columns % 4) + 1;
                setColumns(nextColumns as 1 | 2 | 3 | 4);
              }}
            >
              {columns}
            </Button>
            <div className="flex-1">
              <div className="mb-1">
                {columns === 1 && (
                  <div className="flex gap-1">
                    <div className="w-full h-8 bg-primary/20 rounded"></div>
                  </div>
                )}
                {columns === 2 && (
                  <div className="flex gap-1">
                    <div className="w-full h-8 bg-primary/20 rounded"></div>
                    <div className="w-full h-8 bg-primary/20 rounded"></div>
                  </div>
                )}
                {columns === 3 && (
                  <div className="flex gap-1">
                    <div className="w-full h-8 bg-primary/20 rounded"></div>
                    <div className="w-full h-8 bg-primary/20 rounded"></div>
                    <div className="w-full h-8 bg-primary/20 rounded"></div>
                  </div>
                )}
                {columns === 4 && (
                  <div className="flex gap-1">
                    <div className="w-full h-6 bg-primary/20 rounded"></div>
                    <div className="w-full h-6 bg-primary/20 rounded"></div>
                    <div className="w-full h-6 bg-primary/20 rounded"></div>
                    <div className="w-full h-6 bg-primary/20 rounded"></div>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {columns} Column{columns > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => onAddSection(columns)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>
      </div>

      {/* Add Block */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Block
        </h3>
        {!selectedSectionId && (
          <p className="text-sm text-muted-foreground mb-3">
            Select a section first to add blocks
          </p>
        )}
        <div className="space-y-2">
          {blockTypes.map((blockType) => (
            <button
              key={blockType.type}
              onClick={() => onSelectBlockType(blockType.type)}
              disabled={!selectedSectionId}
              className="w-full p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start gap-3">
                <div className="text-primary mt-1">{blockType.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{blockType.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {blockType.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <Card className="p-4 bg-muted/50">
        <h4 className="text-xs font-semibold mb-2">Editor Rules</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Sections control layout</li>
          <li>• Blocks fill section columns</li>
          <li>• Drag to reorder</li>
          <li>• Click to select & edit</li>
        </ul>
      </Card>
    </div>
  );
}
