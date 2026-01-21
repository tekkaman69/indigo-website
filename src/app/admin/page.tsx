'use client';

import { AdminGuard } from '@/components/admin/AdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import GradientButton from '@/components/ui/GradientButton';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { LogOut, FolderOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Template from '../template';

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Déconnexion réussie',
        description: 'À bientôt !',
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de se déconnecter',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminGuard>
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-primary via-accent to-cyan-400 bg-clip-text text-transparent">
                Admin Indigo
              </h1>
              <p className="mt-2 text-muted-foreground">
                Tableau de bord administrateur
              </p>
            </div>

            {/* Actions Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Portfolio Card */}
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle>Portfolio</CardTitle>
                      <CardDescription>
                        Gérer les projets
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <GradientButton
                    onClick={() => router.push('/admin/portfolio')}
                    className="w-full"
                  >
                    Accéder au portfolio
                  </GradientButton>
                </CardContent>
              </Card>

              {/* Logout Card */}
              <Card className="hover:border-destructive/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive">
                      <LogOut className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle>Déconnexion</CardTitle>
                      <CardDescription>
                        Quitter le dashboard
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <GradientButton
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r from-destructive to-destructive/80"
                  >
                    Se déconnecter
                  </GradientButton>
                </CardContent>
              </Card>
            </div>

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  ✅ Vous êtes connecté en tant qu'administrateur autorisé
                </p>
                <p>
                  📁 La gestion du portfolio sera disponible prochainement
                </p>
                <p>
                  🔐 Votre session est sécurisée par Firebase Authentication
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Template>
    </AdminGuard>
  );
}
