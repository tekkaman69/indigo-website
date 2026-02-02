'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getServices, addService, updateService, deleteService } from '@/lib/firebase/marketplace';
import type { Service, ServiceCategory, FormQuestion, QuestionType } from '@/types/marketplace';
import { Plus, Pencil, Trash2, X, GripVertical } from 'lucide-react';
import Template from '../../template';
import { Badge } from '@/components/ui/badge';

const categories: ServiceCategory[] = [
  'Motion Design',
  'Montage Vidéo',
  'Réseaux sociaux',
  'Graphisme',
  'Automatisation',
];

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: 'short_text', label: 'Texte court' },
  { value: 'long_text', label: 'Texte long' },
  { value: 'select', label: 'Sélection unique' },
  { value: 'multiple_select', label: 'Sélection multiple' },
];

export default function AdminServicesPage() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    category: ServiceCategory | '';
    description: string;
    price: number;
    deliveryTime: number;
    active: boolean;
    imageUrl?: string;
  }>({
    title: '',
    category: '',
    description: '',
    price: 0,
    deliveryTime: 7,
    active: true,
    imageUrl: '',
  });

  const [formQuestions, setFormQuestions] = useState<FormQuestion[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await getServices(false);
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les services',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      price: 0,
      deliveryTime: 7,
      active: true,
      imageUrl: '',
    });
    setFormQuestions([]);
    setEditingService(null);
    setShowDialog(false);
    setImageFile(null);
    setImagePreview('');
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      category: service.category,
      description: service.description,
      price: service.price,
      deliveryTime: service.deliveryTime,
      active: service.active,
      imageUrl: service.imageUrl || '',
    });
    setFormQuestions(service.formSchema);
    setImagePreview(service.imageUrl || '');
    setShowDialog(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Erreur',
          description: "L'image ne doit pas dépasser 5 MB",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le titre est requis',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: 'Erreur',
        description: 'La catégorie est requise',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: 'Erreur',
        description: 'La description est requise',
        variant: 'destructive',
      });
      return;
    }

    if (formData.price <= 0) {
      toast({
        title: 'Erreur',
        description: 'Le prix doit être supérieur à 0',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = formData.imageUrl || '';

      // Upload image if new file selected
      if (imageFile) {
        const { uploadImage, generateUniqueFileName } = await import('@/lib/firebase/storage');
        const fileName = generateUniqueFileName(imageFile.name);
        const path = `services/${fileName}`;
        imageUrl = await uploadImage(imageFile, path);
      }

      const serviceData = {
        title: formData.title,
        category: formData.category as ServiceCategory,
        description: formData.description,
        price: formData.price,
        deliveryTime: formData.deliveryTime,
        active: formData.active,
        imageUrl,
        formSchema: formQuestions,
      };

      if (editingService) {
        await updateService(editingService.id, serviceData);
        toast({
          title: 'Service mis à jour',
          description: 'Le service a été mis à jour avec succès',
        });
      } else {
        await addService(serviceData);
        toast({
          title: 'Service créé',
          description: 'Le service a été créé avec succès',
        });
      }

      await loadServices();
      resetForm();
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast({
        title: 'Erreur',
        description: error?.message || 'Impossible de sauvegarder le service',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      return;
    }

    try {
      await deleteService(id);
      toast({
        title: 'Service supprimé',
        description: 'Le service a été supprimé avec succès',
      });
      await loadServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le service',
        variant: 'destructive',
      });
    }
  };

  const addQuestion = () => {
    setFormQuestions([
      ...formQuestions,
      {
        id: crypto.randomUUID(),
        label: '',
        type: 'short_text',
        required: false,
        options: [],
        placeholder: '',
      },
    ]);
  };

  const updateQuestion = (index: number, updates: Partial<FormQuestion>) => {
    const updated = [...formQuestions];
    updated[index] = { ...updated[index], ...updates };
    setFormQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setFormQuestions(formQuestions.filter((_, i) => i !== index));
  };

  return (
    <AdminGuard>
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Gestion des Services</h1>
              <p className="text-muted-foreground">
                Créez et gérez les services de votre marketplace
              </p>
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setShowDialog(true); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau Service
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingService ? 'Modifier le service' : 'Nouveau service'}
                  </DialogTitle>
                  <DialogDescription>
                    Remplissez les informations du service
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        Titre <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Motion Design 30 secondes"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Catégorie <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value as ServiceCategory })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Description du service..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Image / GIF (16:9 recommandé)</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {imagePreview && (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">
                          Prix (€) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deliveryTime">
                          Délai de livraison (jours)
                        </Label>
                        <Input
                          id="deliveryTime"
                          type="number"
                          min="1"
                          value={formData.deliveryTime}
                          onChange={(e) => setFormData({ ...formData, deliveryTime: parseInt(e.target.value) || 7 })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="active"
                        checked={formData.active}
                        onCheckedChange={(checked) => setFormData({ ...formData, active: !!checked })}
                      />
                      <Label htmlFor="active">Service actif (visible sur le site)</Label>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-base">Formulaire de questions</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter une question
                      </Button>
                    </div>

                    {formQuestions.map((question, index) => (
                      <Card key={question.id}>
                        <CardContent className="pt-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                              <span className="text-sm font-medium">Question {index + 1}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeQuestion(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <Label>Libellé de la question</Label>
                            <Input
                              value={question.label}
                              onChange={(e) => updateQuestion(index, { label: e.target.value })}
                              placeholder="Quelle est la durée souhaitée de votre vidéo ?"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Type de question</Label>
                              <Select
                                value={question.type}
                                onValueChange={(value) => updateQuestion(index, { type: value as QuestionType })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {questionTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Placeholder (optionnel)</Label>
                              <Input
                                value={question.placeholder || ''}
                                onChange={(e) => updateQuestion(index, { placeholder: e.target.value })}
                                placeholder="Ex: 30 secondes"
                              />
                            </div>
                          </div>

                          {(question.type === 'select' || question.type === 'multiple_select') && (
                            <div className="space-y-2">
                              <Label>Options (une par ligne)</Label>
                              <Textarea
                                value={(question.options || []).join('\n')}
                                onChange={(e) => updateQuestion(index, { options: e.target.value.split('\n').filter(Boolean) })}
                                placeholder="Option 1&#10;Option 2&#10;Option 3"
                                rows={4}
                              />
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`required-${index}`}
                              checked={question.required}
                              onCheckedChange={(checked) => updateQuestion(index, { required: !!checked })}
                            />
                            <Label htmlFor={`required-${index}`}>Question obligatoire</Label>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Enregistrement...' : editingService ? 'Mettre à jour' : 'Créer'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Services List */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : services.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">Aucun service créé</p>
                <Button className="mt-4" onClick={() => setShowDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer votre premier service
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{service.title}</h3>
                          <Badge variant={service.active ? 'default' : 'secondary'}>
                            {service.active ? 'Actif' : 'Inactif'}
                          </Badge>
                          <Badge variant="outline">{service.category}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{service.description}</p>
                        <div className="flex items-center gap-6 text-sm">
                          <span className="font-semibold text-lg">{service.price.toFixed(2)} €</span>
                          <span className="text-muted-foreground">
                            Livraison: {service.deliveryTime} jours
                          </span>
                          <span className="text-muted-foreground">
                            {service.formSchema.length} question(s)
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(service)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Template>
    </AdminGuard>
  );
}
