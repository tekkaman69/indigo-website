'use client';

import { useState, useCallback } from 'react';
import {
  Project,
  Section,
  Block,
  EditorState,
  createEmptyProject,
  createSection,
  createBlock,
  createImageBlock,
  BlockType,
} from '@/types/portfolio-editor';

/**
 * Portfolio Editor Hook
 * Centralized state management for the editor
 */
export function usePortfolioEditor(initialProject?: Project) {
  const [state, setState] = useState<EditorState>({
    project: initialProject || createEmptyProject(),
    selectedSectionId: null,
    selectedBlockId: null,
    isDragging: false,
    draggedItem: null,
  });

  // ============================================================================
  // PROJECT ACTIONS
  // ============================================================================

  const updateProjectMetadata = useCallback(
    (updates: Partial<Pick<Project, 'title' | 'description' | 'category' | 'date' | 'coverImage' | 'coverPosition' | 'tags' | 'featured'>>) => {
      setState((prev) => ({
        ...prev,
        project: {
          ...prev.project,
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      }));
    },
    []
  );

  // ============================================================================
  // SECTION ACTIONS
  // ============================================================================

  const addSection = useCallback((columns: 1 | 2 | 3 | 4) => {
    const newSection = createSection(columns);
    setState((prev) => {
      const sections = [...prev.project.sections];

      // Insert before the currently selected section, or at the end if no selection
      if (prev.selectedSectionId) {
        const selectedIndex = sections.findIndex((s) => s.id === prev.selectedSectionId);
        if (selectedIndex !== -1) {
          sections.splice(selectedIndex, 0, newSection);
        } else {
          sections.push(newSection);
        }
      } else {
        sections.push(newSection);
      }

      return {
        ...prev,
        project: {
          ...prev.project,
          sections,
          updatedAt: new Date().toISOString(),
        },
        selectedSectionId: newSection.id,
        selectedBlockId: null,
      };
    });
  }, []);

  const updateSection = useCallback((sectionId: string, updates: Partial<Section>) => {
    setState((prev) => ({
      ...prev,
      project: {
        ...prev.project,
        sections: prev.project.sections.map((section) => {
          if (section.id !== sectionId) return section;

          const updatedSection = { ...section, ...updates };

          // If columns changed, only keep blocks that fit
          if (updates.columns !== undefined && updates.columns !== section.columns) {
            const targetColumns = updates.columns;
            if (section.blocks.length > targetColumns) {
              updatedSection.blocks = updatedSection.blocks.slice(0, targetColumns);
            }
          }

          return updatedSection;
        }),
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const deleteSection = useCallback((sectionId: string) => {
    setState((prev) => ({
      ...prev,
      project: {
        ...prev.project,
        sections: prev.project.sections.filter((section) => section.id !== sectionId),
        updatedAt: new Date().toISOString(),
      },
      selectedSectionId: prev.selectedSectionId === sectionId ? null : prev.selectedSectionId,
      selectedBlockId: null,
    }));
  }, []);

  const moveSectionUp = useCallback((sectionId: string) => {
    setState((prev) => {
      const index = prev.project.sections.findIndex((s) => s.id === sectionId);
      if (index <= 0) return prev;

      const sections = [...prev.project.sections];
      [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];

      return {
        ...prev,
        project: {
          ...prev.project,
          sections,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const moveSectionDown = useCallback((sectionId: string) => {
    setState((prev) => {
      const index = prev.project.sections.findIndex((s) => s.id === sectionId);
      if (index < 0 || index >= prev.project.sections.length - 1) return prev;

      const sections = [...prev.project.sections];
      [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];

      return {
        ...prev,
        project: {
          ...prev.project,
          sections,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const moveSection = useCallback((fromIndex: number, toIndex: number) => {
    setState((prev) => {
      const sections = [...prev.project.sections];
      const [movedSection] = sections.splice(fromIndex, 1);
      sections.splice(toIndex, 0, movedSection);

      return {
        ...prev,
        project: {
          ...prev.project,
          sections,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  // ============================================================================
  // BLOCK ACTIONS
  // ============================================================================

  const addBlock = useCallback((sectionId: string, blockType: BlockType) => {
    const newBlock = createBlock(blockType);

    setState((prev) => {
      const section = prev.project.sections.find((s) => s.id === sectionId);
      if (!section || section.blocks.length >= section.columns) {
        return prev;
      }

      return {
        ...prev,
        project: {
          ...prev.project,
          sections: prev.project.sections.map((section) =>
            section.id === sectionId
              ? { ...section, blocks: [...section.blocks, newBlock] }
              : section
          ),
          updatedAt: new Date().toISOString(),
        },
        selectedBlockId: newBlock.id,
        selectedSectionId: sectionId,
      };
    });
  }, []);

  const updateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    console.log('[EDITOR_STATE] Updating block:', { blockId, updates });
    setState((prev) => {
      const newState = {
        ...prev,
        project: {
          ...prev.project,
          sections: prev.project.sections.map((section) => ({
            ...section,
            blocks: section.blocks.map((block) =>
              block.id === blockId ? { ...block, ...updates } : block
            ),
          })),
          updatedAt: new Date().toISOString(),
        },
      };
      console.log('[EDITOR_STATE] New block state:', newState.project.sections.flatMap(s => s.blocks).find(b => b.id === blockId));
      return newState;
    });
  }, []);

  const deleteBlock = useCallback((blockId: string) => {
    setState((prev) => ({
      ...prev,
      project: {
        ...prev.project,
        sections: prev.project.sections.map((section) => ({
          ...section,
          blocks: section.blocks.filter((block) => block.id !== blockId),
        })),
        updatedAt: new Date().toISOString(),
      },
      selectedBlockId: prev.selectedBlockId === blockId ? null : prev.selectedBlockId,
    }));
  }, []);

  const changeBlockType = useCallback((blockId: string, newType: BlockType) => {
    setState((prev) => {
      const newBlock = createBlock(newType);
      return {
        ...prev,
        project: {
          ...prev.project,
          sections: prev.project.sections.map((section) => ({
            ...section,
            blocks: section.blocks.map((block) =>
              block.id === blockId ? { ...newBlock, id: block.id } : block
            ),
          })),
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const moveBlockWithinSection = useCallback(
    (sectionId: string, fromIndex: number, toIndex: number) => {
      setState((prev) => ({
        ...prev,
        project: {
          ...prev.project,
          sections: prev.project.sections.map((section) => {
            if (section.id !== sectionId) return section;

            const blocks = [...section.blocks];
            const [movedBlock] = blocks.splice(fromIndex, 1);
            blocks.splice(toIndex, 0, movedBlock);

            return { ...section, blocks };
          }),
          updatedAt: new Date().toISOString(),
        },
      }));
    },
    []
  );

  const moveBlockBetweenSections = useCallback(
    (fromSectionId: string, toSectionId: string, blockId: string, toIndex: number) => {
      setState((prev) => {
        const fromSection = prev.project.sections.find((s) => s.id === fromSectionId);
        const toSection = prev.project.sections.find((s) => s.id === toSectionId);

        if (!fromSection || !toSection) return prev;
        if (toSection.blocks.length >= toSection.columns) return prev;

        const block = fromSection.blocks.find((b) => b.id === blockId);
        if (!block) return prev;

        return {
          ...prev,
          project: {
            ...prev.project,
            sections: prev.project.sections.map((section) => {
              if (section.id === fromSectionId) {
                return {
                  ...section,
                  blocks: section.blocks.filter((b) => b.id !== blockId),
                };
              }
              if (section.id === toSectionId) {
                const blocks = [...section.blocks];
                blocks.splice(toIndex, 0, block);
                return { ...section, blocks };
              }
              return section;
            }),
            updatedAt: new Date().toISOString(),
          },
        };
      });
    },
    []
  );

  // ============================================================================
  // SELECTION ACTIONS
  // ============================================================================

  const selectSection = useCallback((sectionId: string) => {
    setState((prev) => ({
      ...prev,
      selectedSectionId: sectionId,
      selectedBlockId: null,
    }));
  }, []);

  const selectBlock = useCallback((blockId: string, sectionId: string) => {
    setState((prev) => ({
      ...prev,
      selectedSectionId: sectionId,
      selectedBlockId: blockId,
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedSectionId: null,
      selectedBlockId: null,
    }));
  }, []);

  // ============================================================================
  // UTILITY ACTIONS
  // ============================================================================

  const getSelectedSection = useCallback(() => {
    if (!state.selectedSectionId) return null;
    return state.project.sections.find((s) => s.id === state.selectedSectionId) || null;
  }, [state.project.sections, state.selectedSectionId]);

  const getSelectedBlock = useCallback(() => {
    if (!state.selectedBlockId) return null;

    for (const section of state.project.sections) {
      const block = section.blocks.find((b) => b.id === state.selectedBlockId);
      if (block) return block;
    }
    return null;
  }, [state.project.sections, state.selectedBlockId]);

  const loadProject = useCallback((project: Project) => {
    setState({
      project,
      selectedSectionId: null,
      selectedBlockId: null,
      isDragging: false,
      draggedItem: null,
    });
  }, []);

  return {
    // State
    project: state.project,
    selectedSectionId: state.selectedSectionId,
    selectedBlockId: state.selectedBlockId,
    selectedSection: getSelectedSection(),
    selectedBlock: getSelectedBlock(),

    // Project actions
    updateProjectMetadata,

    // Section actions
    addSection,
    updateSection,
    deleteSection,
    moveSectionUp,
    moveSectionDown,
    moveSection,

    // Block actions
    addBlock,
    updateBlock,
    deleteBlock,
    changeBlockType,
    moveBlockWithinSection,
    moveBlockBetweenSections,

    // Selection actions
    selectSection,
    selectBlock,
    clearSelection,

    // Utility
    loadProject,
  };
}
