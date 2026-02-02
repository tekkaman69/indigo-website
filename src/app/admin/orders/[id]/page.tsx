'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  getOrderById,
  getOrderMessages,
  getOrderFiles,
  updateOrderStatus,
  addOrderMessage,
  addOrderFile,
  deleteOrderFile,
} from '@/lib/firebase/marketplace';
import { uploadFile } from '@/lib/firebase/storage';
import type { Order, OrderStatus, OrderMessage, OrderFile } from '@/types/marketplace';
import Template from '@/app/template';
import OrderTimeline from '@/components/marketplace/OrderTimeline';
import { ArrowLeft, Send, Upload, Download, Trash2, Copy, Package } from 'lucide-react';

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'En attente de paiement' },
  { value: 'paid', label: 'Payé' },
  { value: 'in_progress', label: 'En cours de production' },
  { value: 'delivered', label: 'Livré' },
  { value: 'cancelled', label: 'Annulé' },
];

interface PageProps {
  params: { id: string };
}

export default function AdminOrderDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<OrderMessage[]>([]);
  const [files, setFiles] = useState<OrderFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('pending');

  useEffect(() => {
    loadOrderData();
  }, [params.id]);

  const loadOrderData = async () => {
    try {
      setIsLoading(true);
      const [orderData, messagesData, filesData] = await Promise.all([
        getOrderById(params.id),
        getOrderMessages(params.id),
        getOrderFiles(params.id),
      ]);

      if (!orderData) {
        toast({
          title: 'Commande introuvable',
          description: 'Cette commande n\'existe pas',
          variant: 'destructive',
        });
        router.push('/admin/orders');
        return;
      }

      setOrder(orderData);
      setMessages(messagesData);
      setFiles(filesData);
      setSelectedStatus(orderData.status);
    } catch (error) {
      console.error('Error loading order:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la commande',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;

    try {
      await updateOrderStatus(order.id, newStatus);
      await addOrderMessage(
        order.id,
        `Statut de la commande changé à: ${statusOptions.find((s) => s.value === newStatus)?.label}`,
        'system'
      );
      setSelectedStatus(newStatus);
      toast({
        title: 'Statut mis à jour',
        description: 'Le statut de la commande a été mis à jour',
      });
      await loadOrderData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive',
      });
    }
  };

  const handleSendMessage = async () => {
    if (!order || !newMessage.trim()) return;

    setIsSendingMessage(true);
    try {
      await addOrderMessage(order.id, newMessage, 'admin');
      setNewMessage('');
      toast({
        title: 'Message envoyé',
        description: 'Le message a été ajouté à la commande',
      });
      await loadOrderData();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message',
        variant: 'destructive',
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!order) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: 'Fichier trop volumineux',
        description: 'Le fichier ne doit pas dépasser 100 MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingFile(true);
    try {
      const path = `deliveries/${order.id}/${file.name}`;
      const url = await uploadFile(file, path);
      await addOrderFile(order.id, file.name, url, file.size);
      await addOrderMessage(order.id, `Fichier livré: ${file.name}`, 'system');
      toast({
        title: 'Fichier uploadé',
        description: 'Le fichier a été ajouté à la livraison',
      });
      await loadOrderData();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'uploader le fichier',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) return;

    try {
      await deleteOrderFile(fileId);
      toast({
        title: 'Fichier supprimé',
        description: 'Le fichier a été supprimé',
      });
      await loadOrderData();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le fichier',
        variant: 'destructive',
      });
    }
  };

  const copyMagicLink = () => {
    if (!order) return;
    const url = `${window.location.origin}/order/${order.magicToken}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Lien copié',
      description: 'Le lien magique a été copié dans le presse-papier',
    });
  };

  if (isLoading) {
    return (
      <AdminGuard>
        <Template>
          <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
            <p className="text-center text-muted-foreground">Chargement...</p>
          </div>
        </Template>
      </AdminGuard>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <AdminGuard>
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <Button variant="ghost" onClick={() => router.push('/admin/orders')} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux commandes
          </Button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Commande {order.orderId}</h1>
            <Button variant="outline" size="sm" onClick={copyMagicLink}>
              <Copy className="mr-2 h-4 w-4" />
              Copier le lien de suivi client
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Client Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations Client</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{order.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date de commande</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-medium text-lg">{order.total.toFixed(2)} €</p>
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
                          <p className="text-sm font-medium">Réponses du client:</p>
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

              {/* Messages */}
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>Communiquez avec le client</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg border ${
                          message.type === 'admin'
                            ? 'bg-primary/10 border-primary/20'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge
                            variant={message.type === 'admin' ? 'default' : 'secondary'}
                          >
                            {message.type === 'admin' ? 'Vous' : 'Système'}
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
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="newMessage">Nouveau message</Label>
                    <Textarea
                      id="newMessage"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Écrivez un message au client..."
                      rows={3}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSendingMessage}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {isSendingMessage ? 'Envoi...' : 'Envoyer'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Files */}
              <Card>
                <CardHeader>
                  <CardTitle>Fichiers de livraison</CardTitle>
                  <CardDescription>Uploadez les fichiers finaux</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {files.length > 0 && (
                    <div className="space-y-3">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{file.fileName}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.fileSize / 1024 / 1024).toFixed(2)} MB •{' '}
                              {new Date(file.uploadedAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <a
                                href={file.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteFile(file.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Label htmlFor="fileUpload">
                      Upload un nouveau fichier (max 100 MB)
                    </Label>
                    <Input
                      id="fileUpload"
                      type="file"
                      onChange={handleFileUpload}
                      disabled={isUploadingFile}
                      className="mt-2"
                    />
                    {isUploadingFile && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Upload en cours...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Status Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Statut de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Changer le statut</Label>
                    <Select value={selectedStatus} onValueChange={handleStatusChange}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderTimeline status={order.status} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Template>
    </AdminGuard>
  );
}
