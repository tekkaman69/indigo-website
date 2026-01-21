'use client';

import { usePortfolioEditor } from '@/hooks/usePortfolioEditor';
import { EditorSidebar } from './sidebar/EditorSidebar';
import { EditorCanvas } from './canvas/EditorCanvas';
import { PropertiesPanel } from './properties/PropertiesPanel';
import { CoverModule } from './CoverModule';
import { Project, BlockType } from '@/types/portfolio-editor';
import { Button } from '@/components/ui/button';
import { Save, X, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { PORTFOLIO_TAG_GROUPS, PORTFOLIO_CATEGORIES } from '@/config/portfolio-taxonomy';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PortfolioEditorProps {
  initialProject?: Project;
  onSave: (project: Project) => Promise<void>;
  onCancel: () => void;
  onPreview?: (project: Project) => void;
}

export function PortfolioEditor({
  initialProject,
  onSave,
  onCancel,
  onPreview,
}: PortfolioEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showMetadata, setShowMetadata] = useState(!initialProject);

  const {
    project,
    selectedSectionId,
    selectedBlockId,
    selectedSection,
    selectedBlock,
    updateProjectMetadata,
    addSection,
    updateSection,
    deleteSection,
    moveSectionUp,
    moveSectionDown,
    moveSection,
    addBlock,
    updateBlock,
    deleteBlock,
    changeBlockType,
    moveBlockWithinSection,
    moveBlockBetweenSections,
    selectSection,
    selectBlock,
    clearSelection,
  } = usePortfolioEditor(initialProject);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(project);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBlock = (sectionId: string, blockType: BlockType) => {
    addBlock(sectionId, blockType);
  };

  const canMoveSectionUp =
    selectedSectionId !== null &&
    project.sections.findIndex((s) => s.id === selectedSectionId) > 0;

  const canMoveSectionDown =
    selectedSectionId !== null &&
    project.sections.findIndex((s) => s.id === selectedSectionId) <
      project.sections.length - 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedBlockId) {
        const activeElement = document.activeElement;
        if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
          return;
        }
        deleteBlock(selectedBlockId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockId, deleteBlock]);

  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col">
      {/* Top bar */}
      <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-bold tracking-tighter">
              <span className="bg-gradient-to-r from-primary via-accent to-cyan-400 bg-clip-text text-transparent">
                Indigo
              </span>
            </h1>
            <span className="text-xl font-medium text-foreground/90">Portfolio Editor</span>
          </div>
          {project.title && (
            <span className="text-sm text-muted-foreground/70">
              {project.title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMetadata(!showMetadata)}
          >
            Metadata
          </Button>

          {onPreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreview(project)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
          )}

          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            <X className="w-4 h-4 mr-1" />
            Close
          </Button>
        </div>
      </div>

      {/* Metadata modal */}
      {showMetadata && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Project Metadata</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={project.title}
                  onChange={(e) => updateProjectMetadata({ title: e.target.value })}
                  placeholder="Project title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={project.description}
                  onChange={(e) => updateProjectMetadata({ description: e.target.value })}
                  placeholder="Project description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={project.category} onValueChange={(value) => updateProjectMetadata({ category: value })}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="z-[200]">
                      {PORTFOLIO_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={project.date}
                    onChange={(e) => updateProjectMetadata({ date: e.target.value })}
                  />
                </div>
              </div>

              <CoverModule
                projectId={project.id}
                coverImage={project.coverImage}
                coverPosition={project.coverPosition}
                onUpdate={(updates) => updateProjectMetadata(updates)}
              />

              <div>
                <Label>Tags</Label>
                <div className="mt-2 max-h-64 overflow-y-auto border border-border rounded-lg p-4 space-y-4">
                  {Object.entries(PORTFOLIO_TAG_GROUPS).map(([groupName, tags]) => (
                    <div key={groupName}>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">{groupName}</p>
                      <div className="space-y-2 ml-2">
                        {tags.map((tag) => (
                          <div key={tag} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`tag-${tag}`}
                              checked={project.tags.includes(tag)}
                              onChange={(e) => {
                                const newTags = e.target.checked
                                  ? [...project.tags, tag]
                                  : project.tags.filter((t) => t !== tag);
                                updateProjectMetadata({ tags: newTags });
                              }}
                              className="w-4 h-4 rounded border-border"
                            />
                            <Label htmlFor={`tag-${tag}`} className="cursor-pointer text-sm font-normal">
                              {tag}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {project.tags.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {project.tags.length} tag{project.tags.length > 1 ? 's' : ''} sélectionné{project.tags.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="featured"
                  type="checkbox"
                  checked={project.featured}
                  onChange={(e) => updateProjectMetadata({ featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured Project
                </Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowMetadata(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main editor layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar */}
        <div onClick={(e) => e.stopPropagation()}>
          <EditorSidebar
            onAddSection={(columns) => addSection(columns)}
            onSelectBlockType={(type) => {
              if (selectedSectionId) {
                handleAddBlock(selectedSectionId, type);
              }
            }}
            selectedSectionId={selectedSectionId}
          />
        </div>

        {/* Center canvas */}
        <div className="flex-1" onClick={clearSelection}>
          <EditorCanvas
            project={project}
            selectedSectionId={selectedSectionId}
            selectedBlockId={selectedBlockId}
            onSelectSection={selectSection}
            onSelectBlock={selectBlock}
            onAddBlock={(sectionId) => {
              selectSection(sectionId);
            }}
            onAddSection={() => addSection(1)}
            onMoveSection={moveSection}
            onMoveBlockWithinSection={moveBlockWithinSection}
            onMoveBlockBetweenSections={moveBlockBetweenSections}
          />
        </div>

        {/* Right properties panel */}
        <div onClick={(e) => e.stopPropagation()}>
          <PropertiesPanel
          selectedSection={selectedSection}
          selectedBlock={selectedBlock}
          canMoveSectionUp={canMoveSectionUp}
          canMoveSectionDown={canMoveSectionDown}
          onUpdateSection={(updates) => {
            if (selectedSectionId) {
              updateSection(selectedSectionId, updates);
            }
          }}
          onUpdateBlock={(updates) => {
            if (selectedBlockId) {
              updateBlock(selectedBlockId, updates);
            }
          }}
          onDeleteSection={() => {
            if (selectedSectionId) {
              deleteSection(selectedSectionId);
            }
          }}
          onDeleteBlock={() => {
            if (selectedBlockId) {
              deleteBlock(selectedBlockId);
            }
          }}
          onMoveSectionUp={() => {
            if (selectedSectionId) {
              moveSectionUp(selectedSectionId);
            }
          }}
          onMoveSectionDown={() => {
            if (selectedSectionId) {
              moveSectionDown(selectedSectionId);
            }
          }}
          onChangeBlockType={(newType) => {
            if (selectedBlockId) {
              changeBlockType(selectedBlockId, newType);
            }
          }}
          />
        </div>
      </div>
    </div>
  );
}
