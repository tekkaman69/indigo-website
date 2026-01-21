'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GradientButton from '@/components/ui/GradientButton';
import { useToast } from '@/hooks/use-toast';
import Template from '../../template';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      toast({
        title: 'Connexion réussie',
        description: 'Redirection vers le dashboard...',
      });

      router.push('/admin');
    } catch (error: any) {
      console.error('Login error:', error);

      let errorMessage = 'Une erreur est survenue.';

      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        errorMessage = 'Email ou mot de passe incorrect.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte trouvé avec cet email.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Trop de tentatives. Réessayez plus tard.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erreur de connexion. Vérifiez votre configuration Firebase.';
      }

      toast({
        title: 'Erreur de connexion',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsLoading(false);
    }
  };

  return (
    <Template>
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Indigo</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder au tableau de bord
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@indigo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50"
                  disabled={isLoading}
                />
              </div>
              <GradientButton
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </GradientButton>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-muted-foreground text-center">
                ⚠️ Accès réservé aux administrateurs autorisés uniquement
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Template>
  );
}
