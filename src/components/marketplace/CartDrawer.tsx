'use client';

import { useCart } from '@/hooks/useCart';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, total, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    onOpenChange(false);
    router.push('/services/cart');
  };

  if (items.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Panier</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Votre panier est vide</p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Panier ({items.length})</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.map((item) => (
            <div
              key={item.service.id}
              className="flex gap-4 p-4 rounded-lg border bg-card"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{item.service.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {item.service.category}
                </p>
                <p className="text-sm font-medium">
                  {item.service.price.toFixed(2)} €
                </p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeItem(item.service.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <SheetFooter className="flex-col gap-4">
          <div className="flex justify-between items-center text-lg font-semibold pt-4 border-t">
            <span>Total</span>
            <span>{total.toFixed(2)} €</span>
          </div>
          <Button onClick={handleCheckout} className="w-full" size="lg">
            Commander
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
