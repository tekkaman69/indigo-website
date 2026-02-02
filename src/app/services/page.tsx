'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { getServices } from '@/lib/firebase/marketplace';
import { getSiteSettings } from '@/lib/firebase/firestore';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { isAdminUid } from '@/lib/admin';
import Template from '../template';
import ServiceCard from '@/components/marketplace/ServiceCard';
import CartDrawer from '@/components/marketplace/CartDrawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Construction } from 'lucide-react';
import type { Service, ServiceCategory } from '@/types/marketplace';
import GradientButton from '@/components/ui/GradientButton';

const categories: ServiceCategory[] = [
  'Motion Design',
  'Montage Vidéo',
  'Réseaux sociaux',
  'Graphisme',
  'Automatisation',
];

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pageEnabled, setPageEnabled] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const { addItem, itemCount } = useCart();

  // Check if user is admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isAdminUid(user.uid)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Check if page is enabled and load services
  useEffect(() => {
    checkPageAccessAndLoadServices();
  }, []);

  const checkPageAccessAndLoadServices = async () => {
    try {
      setIsLoading(true);

      // Get site settings to check if Services page is enabled
      const settings = await getSiteSettings();
      setPageEnabled(settings.servicesPageEnabled);

      // Only load services if page is enabled OR user is admin
      // We'll check admin status client-side after auth loads
      const data = await getServices(true);
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

  const handleAddToCart = (service: Service) => {
    addItem({
      service,
      quantity: 1,
      answers: {},
    });
    toast({
      title: 'Ajouté au panier',
      description: `${service.title} a été ajouté au panier`,
    });
  };

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  // Show loading state
  if (isLoading || pageEnabled === null) {
    return (
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="flex items-center justify-center py-20">
            <div className="text-muted-foreground">Chargement...</div>
          </div>
        </div>
      </Template>
    );
  }

  // Show "Coming Soon" if page is disabled AND user is NOT admin
  if (!pageEnabled && !isAdmin) {
    return (
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8">
              <CardContent className="pt-6">
                <Construction className="w-16 h-16 mx-auto mb-6 text-primary" />
                <h1 className="text-3xl font-bold mb-4">Bientôt disponible</h1>
                <p className="text-muted-foreground mb-8">
                  Notre marketplace de services est en cours de préparation.
                  Revenez bientôt pour découvrir nos offres !
                </p>
                <GradientButton onClick={() => router.push('/')}>
                  Retour à l'accueil
                </GradientButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </Template>
    );
  }

  return (
    <Template>
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        {/* Admin warning banner */}
        {isAdmin && !pageEnabled && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-500">
              ⚠️ Cette page est actuellement désactivée pour les visiteurs.
              Vous la voyez car vous êtes administrateur.
              <a href="/admin/settings" className="underline ml-1">
                Activer la page →
              </a>
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nos Services
            </h1>
            <p className="text-lg text-muted-foreground">
              Des services de qualité pour booster votre présence digitale
            </p>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative p-4 rounded-full hover:bg-accent transition-colors"
            aria-label="Ouvrir le panier"
          >
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0"
                variant="default"
              >
                {itemCount}
              </Badge>
            )}
          </button>
        </div>

        {/* Filters */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">Tous</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              Aucun service disponible dans cette catégorie
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </Template>
  );
}
