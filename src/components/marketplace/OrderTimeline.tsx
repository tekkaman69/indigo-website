'use client';

import { Badge } from '@/components/ui/badge';
import { Check, Clock, Package, Truck, XCircle } from 'lucide-react';
import type { OrderStatus } from '@/types/marketplace';

interface OrderTimelineProps {
  status: OrderStatus;
}

const statusConfig = {
  pending: {
    label: 'En attente de paiement',
    icon: Clock,
    color: 'text-yellow-500',
  },
  paid: {
    label: 'Payé',
    icon: Check,
    color: 'text-green-500',
  },
  in_progress: {
    label: 'En cours de production',
    icon: Package,
    color: 'text-blue-500',
  },
  delivered: {
    label: 'Livré',
    icon: Truck,
    color: 'text-green-600',
  },
  cancelled: {
    label: 'Annulé',
    icon: XCircle,
    color: 'text-red-500',
  },
};

const timeline: OrderStatus[] = ['pending', 'paid', 'in_progress', 'delivered'];

export default function OrderTimeline({ status }: OrderTimelineProps) {
  if (status === 'cancelled') {
    const config = statusConfig.cancelled;
    const Icon = config.icon;
    return (
      <div className="flex items-center gap-2 p-4 border border-red-200 rounded-lg bg-red-50">
        <Icon className={`h-5 w-5 ${config.color}`} />
        <span className="font-semibold">{config.label}</span>
      </div>
    );
  }

  const currentIndex = timeline.indexOf(status);

  return (
    <div className="space-y-4">
      {timeline.map((step, index) => {
        const config = statusConfig[step];
        const Icon = config.icon;
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full border-2 ${
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-background border-muted'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              {index < timeline.length - 1 && (
                <div
                  className={`h-12 w-0.5 ${
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
            <div className="flex-1 pt-2">
              <p className={`font-semibold ${isCurrent ? 'text-primary' : ''}`}>
                {config.label}
              </p>
              {isCurrent && (
                <Badge variant="secondary" className="mt-1">
                  En cours
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
