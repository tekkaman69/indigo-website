import { getOrderByToken, getOrderMessages, getOrderFiles } from '@/lib/firebase/marketplace';
import { notFound } from 'next/navigation';
import Template from '@/app/template';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import OrderTimeline from '@/components/marketplace/OrderTimeline';
import { Download, MessageSquare, Package } from 'lucide-react';

interface PageProps {
  params: { token: string };
}

export default async function OrderTrackingPage({ params }: PageProps) {
  const order = await getOrderByToken(params.token);

  if (!order) {
    notFound();
  }

  const messages = await getOrderMessages(order.id);
  const files = await getOrderFiles(order.id);

  return (
    <Template>
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Suivi de commande</h1>
            <p className="text-muted-foreground">
              Commande {order.orderId}
            </p>
          </div>

          <div className="grid gap-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{order.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-medium text-lg">{order.total.toFixed(2)} €</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Services commandés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{item.serviceTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantité: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                    {Object.keys(item.answers).length > 0 && (
                      <div className="mt-4 pt-4 border-t space-y-2">
                        <p className="text-sm font-medium">Informations fournies:</p>
                        {Object.entries(item.answers).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="text-muted-foreground">{key}:</span>{' '}
                            <span>
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Statut de la commande</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderTimeline status={order.status} />
              </CardContent>
            </Card>

            {/* Messages */}
            {messages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg ${
                        message.type === 'admin'
                          ? 'bg-primary/10 border-primary/20'
                          : 'bg-muted'
                      } border`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant={message.type === 'admin' ? 'default' : 'secondary'}>
                          {message.type === 'admin' ? 'Équipe Indigo' : 'Système'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(message.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Files */}
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Fichiers livrés
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{file.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.fileSize / 1024 / 1024).toFixed(2)} MB • Uploadé le{' '}
                          {new Date(file.uploadedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Button asChild>
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger
                        </a>
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Template>
  );
}
