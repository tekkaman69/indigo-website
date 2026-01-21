'use client';

import { Section } from '@/types/portfolio-editor';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SectionPropertiesProps {
  section: Section;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onUpdate: (updates: Partial<Section>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function SectionProperties({
  section,
  canMoveUp,
  canMoveDown,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: SectionPropertiesProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Section Settings</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure layout and spacing
        </p>
      </div>

      {/* Layout */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="columns">Columns</Label>
          <Input
            id="columns"
            type="number"
            value={section.columns}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1;
              if (val >= 1 && val <= 4) {
                onUpdate({ columns: val as 1 | 2 | 3 | 4 });
              }
            }}
            min={1}
            max={4}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {section.blocks.length} / {section.columns} blocks used
          </p>
        </div>

        <div>
          <Label htmlFor="verticalAlign">Vertical Alignment</Label>
          <Select
            value={section.verticalAlign}
            onValueChange={(value) => onUpdate({ verticalAlign: value as any })}
          >
            <SelectTrigger id="verticalAlign">
              <SelectValue placeholder="Select alignment" />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[200]">
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="stretch">Stretch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Spacing */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="gap">Gap (px)</Label>
          <Input
            id="gap"
            type="number"
            value={section.gap}
            onChange={(e) => onUpdate({ gap: parseInt(e.target.value) || 0 })}
            min={0}
            max={100}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Horizontal space between blocks
          </p>
        </div>

        <div>
          <Label htmlFor="marginTop">Margin Top (px)</Label>
          <Input
            id="marginTop"
            type="number"
            value={section.marginTop}
            onChange={(e) => onUpdate({ marginTop: parseInt(e.target.value) || 0 })}
            min={0}
            max={200}
          />
        </div>

        <div>
          <Label htmlFor="marginBottom">Margin Bottom (px)</Label>
          <Input
            id="marginBottom"
            type="number"
            value={section.marginBottom}
            onChange={(e) => onUpdate({ marginBottom: parseInt(e.target.value) || 0 })}
            min={0}
            max={200}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-4 border-t border-border">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="flex-1"
          >
            <ArrowUp className="w-4 h-4 mr-1" />
            Move Up
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="flex-1"
          >
            <ArrowDown className="w-4 h-4 mr-1" />
            Move Down
          </Button>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="w-full"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete Section
        </Button>
      </div>
    </div>
  );
}
