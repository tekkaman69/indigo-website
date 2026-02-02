'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getOrders } from '@/lib/firebase/marketplace';
import type { Order, OrderStatus } from '@/types/marketplace';
import Template from '../../template';
import { Package, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'En attente', variant: 'secondary' },
  paid: { label: 'Payé', variant: 'default' },
  in_progress: { label: 'En cours', variant: 'outline' },
  delivered: { label: 'Livré', variant: 'default' },
  cancelled: { label: 'Annulé', variant: 'destructive' },
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les commandes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyMagicLink = (token: string) => {
    const url = `${window.location.origin}/order/${token}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Lien copié',
      description: 'Le lien magique a été copié dans le presse-papier',
    });
  };

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter((order) => order.status === selectedStatus);

  const ordersByStatus = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    paid: orders.filter((o) => o.status === 'paid').length,
    in_progress: orders.filter((o) => o.status === 'in_progress').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  return (
    <AdminGuard>
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Gestion des Commandes</h1>
            <p className="text-muted-foreground">
              Gérez les commandes et suivez leur avancement
            </p>
          </div>

          <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
            <TabsList className="mb-8">
              <TabsTrigger value="all">
                Toutes ({ordersByStatus.all})
              </TabsTrigger>
              <TabsTrigger value="pending">
                En attente ({ordersByStatus.pending})
              </TabsTrigger>
              <TabsTrigger value="paid">
                Payées ({ordersByStatus.paid})
              </TabsTrigger>
              <TabsTrigger value="in_progress">
                En cours ({ordersByStatus.in_progress})
              </TabsTrigger>
              <TabsTrigger value="delivered">
                Livrées ({ordersByStatus.delivered})
              </TabsTrigger>
            </TabsList>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Chargement...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {selectedStatus === 'all'
                      ? 'Aucune commande pour le moment'
                      : `Aucune commande avec le statut "${statusConfig[selectedStatus as OrderStatus]?.label}"`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{order.orderId}</h3>
                            <Badge variant={statusConfig[order.status].variant}>
                              {statusConfig[order.status].label}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="text-muted-foreground">Client:</span>{' '}
                              <span className="font-medium">{order.customerName}</span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">Email:</span>{' '}
                              {order.customerEmail}
                            </p>
                            <p>
                              <span className="text-muted-foreground">Date:</span>{' '}
                              {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            <p>
                              <span className="text-muted-foreground">Services:</span>{' '}
                              {order.items.map((item) => item.serviceTitle).join(', ')}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <p className="text-2xl font-bold">{order.total.toFixed(2)} €</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyMagicLink(order.magicToken);
                            }}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copier lien
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </Tabs>
        </div>
      </Template>
    </AdminGuard>
  );
}
