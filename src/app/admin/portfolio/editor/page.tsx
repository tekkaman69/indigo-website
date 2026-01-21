'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { PortfolioEditor } from '@/components/portfolio-editor/PortfolioEditor';
import { Project, createEmptyProject } from '@/types/portfolio-editor';
import { getPortfolioItemById, addPortfolioItem, updatePortfolioItem } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const projectId = searchParams.get('id');

  useEffect(() => {
    const loadProject = async () => {
      if (projectId) {
        try {
          const item = await getPortfolioItemById(projectId);
          if (item) {
            // Convert Firebase portfolio item to editor project
            const sections = (item.sections || []).map((section: any) => ({
              ...section,
              id: section.id || crypto.randomUUID(),
              blocks: (section.blocks || []).map((block: any) => ({
                ...block,
                id: block.id || crypto.randomUUID(),
                images: block.images ? block.images.map((img: any) => ({
                  ...img,
                  id: img.id || crypto.randomUUID(),
                })) : undefined,
              })),
            }));

            const editorProject: Project = {
              id: item.id,
              title: item.title,
              description: item.description,
              category: item.category,
              date: item.date,
              coverImage: item.imageUrl,
              coverPosition: item.coverPosition || 'center',
              tags: item.tags,
              featured: item.featured,
              sections,
              createdAt: item.createdAt.toDate().toISOString(),
              updatedAt: item.updatedAt?.toDate().toISOString() || new Date().toISOString(),
              version: item.version || 1,
            };
            console.log('Loaded project sections:', editorProject.sections);
            setProject(editorProject);
          } else {
            toast({
              title: 'Project not found',
              description: 'Starting with new project',
              variant: 'destructive',
            });
            setProject(createEmptyProject());
          }
        } catch (error) {
          console.error('Error loading project:', error);
          toast({
            title: 'Error loading project',
            description: 'Starting with new project',
            variant: 'destructive',
          });
          setProject(createEmptyProject());
        }
      } else {
        // Create new project
        setProject(createEmptyProject());
      }
      setIsLoading(false);
    };

    loadProject();
  }, [projectId, toast]);

  // Recursively remove undefined values from objects and arrays
  const removeUndefined = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(item => removeUndefined(item));
    }
    if (obj !== null && typeof obj === 'object') {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          cleaned[key] = removeUndefined(value);
        }
      }
      return cleaned;
    }
    return obj;
  };

  const handleSave = async (project: Project) => {
    try {
      // Build portfolio data, excluding undefined values
      const portfolioData: any = {
        title: project.title,
        description: project.description,
        category: project.category,
        date: project.date,
        imageUrl: project.coverImage,
        tags: project.tags,
        featured: project.featured,
        sections: project.sections,
        version: project.version,
      };

      // Only add coverPosition if it has a value
      if (project.coverPosition) {
        portfolioData.coverPosition = project.coverPosition;
      }

      // Clean all undefined values recursively
      const cleanedData = removeUndefined(portfolioData);

      console.log('[SAVE] Saving project to Firestore:', cleanedData);
      console.log('[SAVE] Sections:', JSON.stringify(cleanedData.sections, null, 2));

      if (projectId) {
        await updatePortfolioItem(projectId, {
          ...cleanedData,
          updatedAt: Timestamp.now(),
        });
        console.log('[SAVE] Project updated:', projectId);
        toast({
          title: 'Project updated',
          description: 'Your project has been saved successfully',
        });
      } else {
        const newId = await addPortfolioItem({
          ...cleanedData,
          createdAt: Timestamp.now(),
        } as any);
        console.log('[SAVE] Project created:', newId);
        toast({
          title: 'Project created',
          description: 'Your project has been created successfully',
        });
        router.push(`/admin/portfolio/editor?id=${newId}`);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: 'Save failed',
        description: 'Could not save project',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/admin/portfolio');
  };

  const handlePreview = (project: Project) => {
    // TODO: Implement preview
    toast({
      title: 'Preview',
      description: 'Preview feature coming soon',
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <PortfolioEditor
      initialProject={project}
      onSave={handleSave}
      onCancel={handleCancel}
      onPreview={handlePreview}
    />
  );
}

export default function PortfolioEditorPage() {
  return (
    <AdminGuard>
      <Suspense fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-background z-[100]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }>
        <EditorContent />
      </Suspense>
    </AdminGuard>
  );
}
