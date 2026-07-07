'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AdminGuard } from '@/components/admin/AdminGuard';
import Template from '@/app/template';
import {
  getOrderIntentions,
  updateOrderIntention,
} from '@/lib/firebase/firestore';
import type { OrderIntention } from '@/types/firebase';
import {
  ChevronLeft, Loader2, Clock, CheckCircle2, XCircle,
  Mail, Building2, CreditCard, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// ─── Config statuts ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderIntention['status'],
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  pending: { label: 'En attente', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: Clock },
  paid: { label: 'Acompte payé', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: CheckCircle2 },
  failed: { label: 'Échoué / remboursé', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: XCircle },
};

type Filter = 'all' | OrderIntention['status'];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [intentions, setIntentions] = useState<OrderIntention[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setIntentions(await getOrderIntentions());
    } catch {
      toast({ title: 'Erreur de chargement', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id: string, status: OrderIntention['status']) => {
    setUpdatingId(id);
    try {
      await updateOrderIntention(id, { status });
      setIntentions(prev => prev.map(i => (i.id === id ? { ...i, status } : i)));
      toast({ title: `Statut mis à jour : ${STATUS_CONFIG[status].label}` });
    } catch {
      toast({ title: 'Erreur de mise à jour', variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === 'all' ? intentions : intentions.filter(i => i.status === filter);
  const counts = {
    all: intentions.length,
    pending: intentions.filter(i => i.status === 'pending').length,
    paid: intentions.filter(i => i.status === 'paid').length,
    failed: intentions.filter(i => i.status === 'failed').length,
  };

  return (
    <AdminGuard>
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-12 text-white">
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link href="/admin" className="text-white/40 hover:text-white transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-white">Commandes — Acomptes</h1>
                  <p className="text-sm text-white/40 mt-0.5">
                    Intentions de commande des packs (paiement Stripe ou virement)
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={load} className="text-white/50 hover:text-white">
                <RefreshCw className="w-4 h-4 mr-1.5" />
                Actualiser
              </Button>
            </div>

            {/* Filtres */}
            <div className="flex gap-2 flex-wrap mb-6">
              {([
                ['all', 'Toutes'],
                ['pending', 'En attente'],
                ['paid', 'Payées'],
                ['failed', 'Échouées'],
              ] as [Filter, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filter === key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {label} ({counts[key]})
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-xl text-white/30">
                <CreditCard className="w-10 h-10 mb-3" />
                <p className="text-sm">Aucune commande pour ce filtre</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(intention => {
                  const status = STATUS_CONFIG[intention.status];
                  const StatusIcon = status.icon;
                  const date = intention.createdAt?.toDate?.();
                  return (
                    <div
                      key={intention.id}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        {/* Infos client + offre */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 flex-wrap mb-1.5">
                            <h3 className="text-base font-semibold text-white">{intention.clientName}</h3>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${status.bg} ${status.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </span>
                          </div>
                          <p className="text-sm text-indigo-300">{intention.offerLabel}</p>
                          <div className="mt-2 flex items-center gap-4 flex-wrap text-xs text-white/40">
                            <a href={`mailto:${intention.clientEmail}`} className="flex items-center gap-1.5 hover:text-white/70 transition-colors">
                              <Mail className="w-3 h-3" />
                              {intention.clientEmail}
                            </a>
                            {intention.clientCompany && (
                              <span className="flex items-center gap-1.5">
                                <Building2 className="w-3 h-3" />
                                {intention.clientCompany}
                              </span>
                            )}
                            {date && <span>{date.toLocaleDateString('fr-FR')} à {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>}
                          </div>
                          {intention.clientDescription && (
                            <p className="mt-2 text-xs text-white/50 italic line-clamp-2">« {intention.clientDescription} »</p>
                          )}
                          {intention.paymentRef && (
                            <p className="mt-1.5 text-[11px] text-white/25 font-mono">Réf. Stripe : {intention.paymentRef}</p>
                          )}
                        </div>

                        {/* Montants + actions */}
                        <div className="flex-shrink-0 text-right">
                          <p className="text-2xl font-bold text-white tabular-nums">{intention.depositAmount} €</p>
                          <p className="text-xs text-white/35">acompte · total {intention.totalPrice} €</p>
                          <div className="mt-3 flex gap-2 justify-end">
                            {intention.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(intention.id, 'paid')}
                                disabled={updatingId === intention.id}
                                className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30 h-8 text-xs"
                              >
                                {updatingId === intention.id
                                  ? <Loader2 className="w-3 h-3 animate-spin" />
                                  : 'Marquer payé (virement)'}
                              </Button>
                            )}
                            {intention.status === 'paid' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStatusChange(intention.id, 'failed')}
                                disabled={updatingId === intention.id}
                                className="text-white/40 hover:text-red-300 h-8 text-xs"
                              >
                                Marquer remboursé
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Template>
    </AdminGuard>
  );
}
