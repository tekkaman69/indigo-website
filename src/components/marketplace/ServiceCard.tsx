'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ShoppingCart, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import type { Service } from '@/types/marketplace';

interface ServiceCardProps {
  service: Service;
  onAddToCart: (service: Service) => void;
}

export default function ServiceCard({ service, onAddToCart }: ServiceCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden">
      {service.imageUrl && (
        <div className="relative w-full aspect-video overflow-hidden bg-muted">
          <Image
            src={service.imageUrl}
            alt={service.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      {!service.imageUrl && (
        <div className="relative w-full aspect-video overflow-hidden bg-muted flex items-center justify-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary">{service.category}</Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{service.deliveryTime}j</span>
          </div>
        </div>
        <CardTitle className="text-xl">{service.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {service.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="text-3xl font-bold">
          {service.price.toFixed(2)} €
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => onAddToCart(service)}
          className="w-full"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
}
