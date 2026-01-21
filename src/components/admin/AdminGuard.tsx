'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { isAdminUid } from '@/lib/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import GradientButton from '@/components/ui/GradientButton';
import { signOut } from '@/lib/firebase/auth';

type AuthState = 'loading' | 'unauthenticated' | 'not-admin' | 'admin';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setAuthState('unauthenticated');
        router.push('/admin/login');
        return;
      }

      setUser(currentUser);

      if (!isAdminUid(currentUser.uid)) {
        setAuthState('not-admin');
        return;
      }

      setAuthState('admin');
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  if (authState === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Vérification des accès...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authState === 'not-admin') {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">Accès refusé</CardTitle>
            <CardDescription>
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connecté en tant que: <span className="font-medium text-foreground">{user?.email}</span>
            </p>
            <div className="flex flex-col gap-2">
              <GradientButton onClick={handleLogout} className="w-full">
                Se déconnecter
              </GradientButton>
              <GradientButton
                onClick={() => router.push('/')}
                className="w-full bg-transparent hover:bg-white/5"
              >
                Retour à l'accueil
              </GradientButton>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authState === 'admin') {
    return <>{children}</>;
  }

  return null;
}
