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
import { Plus, Pencil, Trash2, Image as ImageIcon, Loader2, Eye, EyeOff } from 'lucide-react';
import Template from '../../template';
import { useRouter } from 'next/navigation';

const emptyForm = {
  title: '',
  description: '',
  category: '',
  date: '',
  imageUrl: '',
  tags: '',
  featured: false,
  published: true,
  order: 0,
  industry: '',
  problem: '',
  solution: '',
  result: '',
};

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
  const [formData, setFormData] = useState({ ...emptyForm });

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
      toast({ title: 'Erreur', description: 'Impossible de charger les projets', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'Erreur', description: 'L\'image ne doit pas dépasser 5 MB', variant: 'destructive' });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ ...emptyForm });
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
      published: project.published ?? true,
      order: project.order ?? 0,
      industry: project.industry ?? '',
      problem: project.problem ?? '',
      solution: project.solution ?? '',
      result: project.result ?? '',
    });
    setImagePreview(project.imageUrl);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    try {
      await deletePortfolioItem(id);
      toast({ title: 'Projet supprimé', description: 'Le projet a été supprimé avec succès' });
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({ title: 'Erreur', description: 'Impossible de supprimer le projet', variant: 'destructive' });
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

      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);

      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        imageUrl,
        tags,
        featured: formData.featured,
        published: formData.published,
        order: Number(formData.order) || 0,
        industry: formData.industry || undefined,
        problem: formData.problem || undefined,
        solution: formData.solution || undefined,
        result: formData.result || undefined,
      };

      if (editingProject) {
        await updatePortfolioItem(editingProject.id, projectData);
        toast({ title: 'Projet mis à jour', description: 'Le projet a été mis à jour avec succès' });
      } else {
        await addPortfolioItem(projectData as any);
        toast({ title: 'Projet créé', description: 'Le projet a été créé avec succès' });
      }

      resetForm();
      loadProjects();
    } catch (error) {
      console.error('Error submitting project:', error);
      toast({ title: 'Erreur', description: 'Une erreur est survenue lors de l\'enregistrement', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (key: keyof typeof emptyForm) => ({
    value: String(formData[key]),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData({ ...formData, [key]: e.target.value }),
  });

  return (
    <AdminGuard>
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-primary via-accent to-cyan-400 bg-clip-text text-transparent">
                  Gestion du Portfolio
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Ajoutez, modifiez et gérez la visibilité de vos projets
                </p>
              </div>
              <div className="flex gap-2">
                {showForm ? (
                  <Button variant="ghost" onClick={resetForm}>Annuler</Button>
                ) : (
                  <Button onClick={() => router.push('/admin/portfolio/editor')} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Éditeur avancé
                  </Button>
                )}
                <Button
                  onClick={() => { resetForm(); setShowForm(true); }}
                  variant={showForm ? 'default' : 'outline'}
                  className="gap-2"
                  disabled={showForm}
                >
                  <Plus className="w-4 h-4" />
                  Ajout rapide
                </Button>
              </div>
            </div>

            {/* Formulaire */}
            {showForm && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>{editingProject ? 'Modifier le projet' : 'Nouveau projet'}</CardTitle>
                  <CardDescription>
                    Remplissez les champs contextuels (Industrie, Problème, Solution, Résultat) pour que le projet s'affiche correctement sur la landing page.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Infos de base */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="title">Titre *</Label>
                        <Input id="title" placeholder="Nom du projet" required {...field('title')} disabled={isSubmitting} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="category">Catégorie *</Label>
                        <Input id="category" placeholder="branding / contenu / site" required {...field('category')} disabled={isSubmitting} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" placeholder="2024-01" {...field('date')} disabled={isSubmitting} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="order">Ordre d'affichage</Label>
                        <Input id="order" type="number" min={0} {...field('order')} disabled={isSubmitting} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="industry">Industrie / Secteur</Label>
                        <Input id="industry" placeholder="Décoration, Barber..." {...field('industry')} disabled={isSubmitting} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Description générale du projet" {...field('description')} disabled={isSubmitting} />
                    </div>

                    {/* Champs contextuels landing */}
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-4">
                      <p className="text-sm font-medium text-primary">Champs landing page (contextualisés)</p>
                      <div className="space-y-1.5">
                        <Label htmlFor="problem">Problème rencontré</Label>
                        <Textarea id="problem" placeholder="Le client avait une image incohérente..." rows={2} {...field('problem')} disabled={isSubmitting} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="solution">Solution apportée</Label>
                        <Textarea id="solution" placeholder="Nous avons créé une charte graphique..." rows={2} {...field('solution')} disabled={isSubmitting} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="result">Résultat obtenu</Label>
                        <Input id="result" placeholder="Augmentation du taux de conversion de 40%" {...field('result')} disabled={isSubmitting} />
                      </div>
                    </div>

                    {/* Image */}
                    <div className="space-y-1.5">
                      <Label htmlFor="imageFile">Image de couverture</Label>
                      <div className="flex items-center gap-4">
                        <Input id="imageFile" type="file" accept="image/*" onChange={handleImageChange} disabled={isSubmitting} className="flex-1" />
                        {imagePreview && (
                          <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-md border border-border" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="tags">Tags (séparés par virgule)</Label>
                      <Input id="tags" placeholder="Next.js, Branding, Figma" {...field('tags')} disabled={isSubmitting} />
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-wrap gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4 rounded"
                          disabled={isSubmitting}
                        />
                        <span className="text-sm">En vedette (featured)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.published}
                          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                          className="w-4 h-4 rounded"
                          disabled={isSubmitting}
                        />
                        <span className="text-sm">Publié (visible sur la landing)</span>
                      </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="submit" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? (
                          <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Enregistrement...</span>
                        ) : editingProject ? 'Mettre à jour' : 'Créer le projet'}
                      </Button>
                      <Button type="button" variant="ghost" onClick={resetForm}>Annuler</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Liste des projets */}
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
                    <p className="text-muted-foreground">Aucun projet pour le moment. Créez-en un !</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <div className="relative h-48 bg-muted">
                        {project.imageUrl ? (
                          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ImageIcon className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                          {project.featured && (
                            <span className="px-2 py-0.5 bg-primary/90 backdrop-blur-sm rounded text-xs font-medium text-white">
                              En vedette
                            </span>
                          )}
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium backdrop-blur-sm ${project.published !== false ? 'bg-green-600/80 text-white' : 'bg-gray-700/80 text-white/70'}`}>
                            {project.published !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            {project.published !== false ? 'Publié' : 'Brouillon'}
                          </span>
                        </div>
                        {project.order !== undefined && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded text-xs text-white/60">
                            #{project.order}
                          </span>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>
                          {project.category}
                          {project.industry ? ` · ${project.industry}` : ''}
                          {project.date ? ` · ${project.date}` : ''}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {project.result && (
                          <p className="text-xs text-green-400 mb-3 line-clamp-1 font-medium">↑ {project.result}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => router.push(`/admin/portfolio/editor?id=${project.id}`)}
                            className="gap-2"
                          >
                            <Pencil className="w-3 h-3" />
                            Éditeur
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(project)}
                            className="gap-2"
                          >
                            <Pencil className="w-3 h-3" />
                            Rapide
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(project.id)}
                            className="gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                            Suppr.
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
