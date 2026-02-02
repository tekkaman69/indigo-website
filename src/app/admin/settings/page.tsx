'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getSiteSettings, updateSiteSettings, SiteSettings } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import Template from '../../template';
import { Settings, Eye, EyeOff, Save, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await getSiteSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les paramètres',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleServicesPage = (enabled: boolean) => {
    if (!settings) return;
    setSettings({ ...settings, servicesPageEnabled: enabled });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setIsSaving(true);
      await updateSiteSettings({ servicesPageEnabled: settings.servicesPageEnabled });
      setHasChanges(false);
      toast({
        title: 'Paramètres sauvegardés',
        description: 'Les modifications ont été enregistrées',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les paramètres',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminGuard>
        <Template>
          <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </div>
        </Template>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
                  Réglages du site
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gérez les paramètres globaux du site
                </p>
              </div>
            </div>

            {/* Settings Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle>Visibilité des pages</CardTitle>
                    <CardDescription>
                      Contrôlez l'accès aux différentes sections du site
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Services Page Toggle */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${settings?.servicesPageEnabled ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {settings?.servicesPageEnabled ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="services-toggle" className="text-base font-medium cursor-pointer">
                        Page Services (Marketplace)
                      </Label>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {settings?.servicesPageEnabled
                          ? 'La page est visible par tous les visiteurs'
                          : 'La page affiche "Bientôt disponible" aux visiteurs'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="services-toggle"
                    checked={settings?.servicesPageEnabled ?? false}
                    onCheckedChange={handleToggleServicesPage}
                  />
                </div>

                {/* Info Box */}
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-blue-400">
                    <strong>Note:</strong> En tant qu'administrateur, vous pouvez toujours voir
                    les pages même lorsqu'elles sont désactivées. Un bandeau jaune vous indique
                    que la page est masquée pour les visiteurs.
                  </p>
                </div>

                {/* Save Button */}
                {hasChanges && (
                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="gap-2"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Sauvegarder
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Liens rapides</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Link
                  href="/services"
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors text-sm"
                >
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  Voir la page Services
                </Link>
                <Link
                  href="/admin/services"
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors text-sm"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Gérer les services
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Template>
    </AdminGuard>
  );
}
