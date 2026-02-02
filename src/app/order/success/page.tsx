'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import Template from '@/app/template';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const orderIdParam = searchParams.get('orderId');

  useEffect(() => {
    // Clear cart after successful payment
    clearCart();
  }, [clearCart]);

  return (
    <Template>
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-3xl">Paiement réussi !</CardTitle>
              <CardDescription className="text-base">
                Merci pour votre commande
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">
                      Confirmation envoyée par email
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Vous allez recevoir un email de confirmation avec un lien de suivi
                      personnalisé pour suivre l'avancement de votre commande.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Prochaines étapes</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>
                      Consultez votre email pour accéder au lien de suivi de votre commande
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>
                      Notre équipe va prendre en charge votre projet et vous tiendra informé
                      via la page de suivi
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span>
                      Vous recevrez vos fichiers finaux directement sur votre page de suivi
                      une fois le projet terminé
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t space-y-3">
                <p className="text-sm text-muted-foreground">
                  Une question ? Contactez-nous à{' '}
                  <a
                    href="mailto:contact@indigo-studio.com"
                    className="text-primary hover:underline"
                  >
                    contact@indigo-studio.com
                  </a>
                </p>
              </div>

              <div className="flex gap-3">
                <Button asChild className="flex-1">
                  <Link href="/services">Voir nos autres services</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/">Retour à l'accueil</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Template>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
