'use client';

import { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import {
  LogOut, FolderOpen, Layers, MessageSquare, Users,
  ChevronRight, TrendingUp, Star, FileStack, ShoppingBag,
  Eye, CheckCircle2, Clock, Grid3x3,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Template from '../template';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

interface Stats {
  portfolioTotal: number;
  portfolioPublished: number;
  testimonials: number;
  formulas: number;
  orders: number;
  ordersPending: number;
}

interface RecentOrder {
  id: string;
  clientName: string;
  offerLabel: string;
  status: string;
  depositAmount: number;
}

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    portfolioTotal: 0, portfolioPublished: 0,
    testimonials: 0, formulas: 0,
    orders: 0, ordersPending: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email ?? null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [portfolio, testimonials, formulas, orderIntentions] = await Promise.all([
          getDocs(collection(db, 'portfolio')),
          getDocs(collection(db, 'testimonials')),
          getDocs(collection(db, 'formulas')),
          getDocs(collection(db, 'order_intentions')),
        ]);

        const publishedCount = portfolio.docs.filter((d) => d.data().published === true).length;
        const pendingCount = orderIntentions.docs.filter((d) => d.data().status === 'pending').length;

        setStats({
          portfolioTotal: portfolio.size,
          portfolioPublished: publishedCount,
          testimonials: testimonials.size,
          formulas: formulas.size,
          orders: orderIntentions.size,
          ordersPending: pendingCount,
        });

        // Dernières intentions de commande
        const recent = orderIntentions.docs
          .map((d) => ({ id: d.id, ...d.data() } as RecentOrder & { createdAt?: unknown }))
          .slice(-3)
          .reverse()
          .map(({ id, clientName, offerLabel, status, depositAmount }) => ({
            id, clientName, offerLabel, status, depositAmount,
          }));
        setRecentOrders(recent);
      } catch {
        // Stats non disponibles
      } finally {
        setIsLoadingStats(false);
      }
    };
    loadStats();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({ title: 'Déconnexion réussie', description: 'À bientôt !' });
      router.push('/admin/login');
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de se déconnecter', variant: 'destructive' });
    }
  };

  const modules = [
    {
      title: 'Portfolio',
      description: 'Projets publiés sur le site',
      icon: FolderOpen,
      href: '/admin/portfolio',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      stat: isLoadingStats ? '…' : `${stats.portfolioPublished} / ${stats.portfolioTotal}`,
      statLabel: 'publiés',
    },
    {
      title: 'Services',
      description: 'Offres & tarifs affichés',
      icon: Layers,
      href: '/admin/formulas',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      stat: isLoadingStats ? '…' : String(stats.formulas),
      statLabel: 'services',
    },
    {
      title: 'Témoignages',
      description: 'Avis clients affichés',
      icon: MessageSquare,
      href: '/admin/testimonials',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      stat: isLoadingStats ? '…' : String(stats.testimonials),
      statLabel: 'avis',
    },
    {
      title: 'Suivi Clients',
      description: 'Commandes & réservations',
      icon: Users,
      href: '/admin/orders',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      stat: isLoadingStats ? '…' : String(stats.orders),
      statLabel: `dont ${stats.ordersPending} en attente`,
    },
    {
      title: 'Projets home',
      description: 'Cartes affichées dans « Nos réalisations »',
      icon: FileStack,
      href: '/admin/mosaic',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      stat: '—',
      statLabel: 'projets home',
    },
    {
      title: 'Feeds Instagram',
      description: 'Mosaïques 3×3 de feeds Insta affichées sur la home',
      icon: Grid3x3,
      href: '/admin/feeds',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      stat: '—',
      statLabel: 'feeds',
    },
  ];

  const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    pending:  { label: 'En attente',  color: 'text-amber-400',  icon: Clock },
    paid:     { label: 'Payé',        color: 'text-emerald-400', icon: CheckCircle2 },
    failed:   { label: 'Échoué',      color: 'text-red-400',     icon: Clock },
  };

  return (
    <AdminGuard>
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="max-w-5xl mx-auto space-y-8">

            {/* ── Header ── */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Tableau de bord
                </h1>
                {userEmail && (
                  <p className="text-white/40 text-sm mt-1">Connecté en tant que {userEmail}</p>
                )}
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="gap-2 border border-white/10 text-white/50 hover:text-red-400 hover:border-red-500/20"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
            </div>

            {/* ── Stats rapides ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Projets publiés', value: stats.portfolioPublished, icon: Eye, color: 'text-indigo-400' },
                { label: 'Témoignages', value: stats.testimonials, icon: Star, color: 'text-amber-400' },
                { label: 'Services actifs', value: stats.formulas, icon: FileStack, color: 'text-violet-400' },
                { label: 'Commandes', value: stats.orders, icon: ShoppingBag, color: 'text-emerald-400' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                    <span className="text-xs text-white/40">{s.label}</span>
                  </div>
                  <p className={`text-3xl font-bold ${s.color}`}>
                    {isLoadingStats ? <span className="text-white/20 text-xl">…</span> : s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Modules ── */}
            <div>
              <h2 className="text-sm uppercase tracking-widest text-white/30 mb-4">Gestion du contenu</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {modules.map((m) => (
                  <Link key={m.href} href={m.href}>
                    <div className={`group rounded-xl border ${m.border} bg-white/5 hover:bg-white/8 transition-all duration-200 p-5 cursor-pointer`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${m.bg} flex-shrink-0`}>
                          <m.icon className={`w-5 h-5 ${m.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-white text-base">{m.title}</h3>
                            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
                          </div>
                          <p className="text-sm text-white/40 mt-0.5">{m.description}</p>
                        </div>
                      </div>
                      <div className={`mt-4 pt-3 border-t border-white/5 flex items-baseline gap-1.5`}>
                        <span className={`text-2xl font-bold ${m.color}`}>{m.stat}</span>
                        <span className="text-xs text-white/30">{m.statLabel}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Commandes récentes ── */}
            {recentOrders.length > 0 && (
              <div>
                <h2 className="text-sm uppercase tracking-widest text-white/30 mb-4">Dernières commandes</h2>
                <div className="space-y-2">
                  {recentOrders.map((order) => {
                    const cfg = statusConfig[order.status] ?? statusConfig.pending;
                    return (
                      <div key={order.id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{order.clientName || 'Client'}</p>
                          <p className="text-xs text-white/40">{order.offerLabel}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {order.depositAmount && (
                            <span className="text-sm font-semibold text-white/70">{order.depositAmount}€</span>
                          )}
                          <div className={`flex items-center gap-1 text-xs ${cfg.color}`}>
                            <cfg.icon className="w-3.5 h-3.5" />
                            {cfg.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Liens vers le site ── */}
            <div className="flex gap-3 pt-2 flex-wrap">
              <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Voir le site
              </Link>
              <Link href="/portfolio" className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                Voir le portfolio
              </Link>
            </div>

          </div>
        </div>
      </Template>
    </AdminGuard>
  );
}
