'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getPortfolioItems, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '@/lib/firebase/firestore';
import { uploadImage, generateUniqueFileName } from '@/lib/firebase/storage';
import type { PortfolioItem } from '@/types/firebase';
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import Template from '../../template';
import { useRouter } from 'next/navigation';

export default function AdminPortfolioPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    imageUrl: '',
    tags: '',
    featured: false,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const items = await getPortfolioItems();
      setProjects(items);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les projets',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Erreur',
          description: 'L\'image ne doit pas dépasser 5 MB',
          variant: 'destructive',
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      date: '',
      imageUrl: '',
      tags: '',
      featured: false,
    });
    setImageFile(null);
    setImagePreview('');
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEdit = (project: PortfolioItem) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      date: project.date,
      imageUrl: project.imageUrl,
      tags: project.tags.join(', '),
      featured: project.featured,
    });
    setImagePreview(project.imageUrl);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      await deletePortfolioItem(id);
      toast({
        title: 'Projet supprimé',
        description: 'Le projet a été supprimé avec succès',
      });
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le projet',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        const fileName = generateUniqueFileName(imageFile.name);
        const path = `portfolio/${fileName}`;
        imageUrl = await uploadImage(imageFile, path);
      }

      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        imageUrl,
        tags,
        featured: formData.featured,
      };

      if (editingProject) {
        await updatePortfolioItem(editingProject.id, projectData);
        toast({
          title: 'Projet mis à jour',
          description: 'Le projet a été mis à jour avec succès',
        });
      } else {
        await addPortfolioItem(projectData as any);
        toast({
          title: 'Projet créé',
          description: 'Le projet a été créé avec succès',
        });
      }

      resetForm();
      loadProjects();
    } catch (error) {
      console.error('Error submitting project:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminGuard>
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-primary via-accent to-cyan-400 bg-clip-text text-transparent">
                  Gestion du Portfolio
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Ajoutez, modifiez et supprimez vos projets
                </p>
              </div>
              <Button
                onClick={() => router.push('/admin/portfolio/editor')}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouveau projet
              </Button>
            </div>


            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Projets existants</h2>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : projects.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Aucun projet pour le moment. Créez-en un !
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <div className="relative h-48 bg-muted">
                        {project.imageUrl ? (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ImageIcon className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                        {project.featured && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-primary/90 backdrop-blur-sm rounded text-xs font-medium">
                            En vedette
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>
                          {project.category} • {project.date}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {project.description}
                        </p>
                        {project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => router.push(`/admin/portfolio/editor?id=${project.id}`)}
                            className="gap-2"
                          >
                            <Pencil className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(project.id)}
                            className="gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Template>
    </AdminGuard>
  );
}
