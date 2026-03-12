'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Building2, Loader2, CheckCircle, X, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import GradientButton from '@/components/ui/GradientButton';
import { useToast } from '@/hooks/use-toast';
import { isValidOfferId, getOffer, getDepositAmount, type OfferId } from '@/lib/lemon';
import { addContactSubmission } from '@/lib/firebase/firestore';

// ============================================
// Formulaire checkout
// ============================================

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const offerParam = searchParams.get('offer') ?? '';
  const offerId = isValidOfferId(offerParam) ? (offerParam as OfferId) : null;
  const offer = offerId ? getOffer(offerId) : null;
  const depositAmount = offer ? getDepositAmount(offer.totalPrice) : 0;

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    clientDescription: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWireModal, setShowWireModal] = useState(false);
  const [wireSubmitting, setWireSubmitting] = useState(false);
  const [wireSent, setWireSent] = useState(false);

  // Offre invalide → retour accueil
  useEffect(() => {
    if (!offer) {
      router.push('/#services');
    }
  }, [offer, router]);

  if (!offer || !offerId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.clientName.trim() || !formData.clientEmail.trim()) {
      toast({ title: 'Champs requis', description: 'Nom et email sont obligatoires.', variant: 'destructive' });
      return;
    }
    if (!emailRegex.test(formData.clientEmail)) {
      toast({ title: 'Email invalide', description: 'Vérifiez votre adresse email.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/checkout/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId, ...formData }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur serveur');
      }

      // Redirect to Lemon Squeezy checkout
      window.location.href = data.checkoutUrl;
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  const handleWireSubmit = async () => {
    if (!formData.clientName.trim() || !formData.clientEmail.trim()) {
      toast({ title: 'Remplissez d\'abord le formulaire', description: 'Nom et email requis avant de procéder par virement.', variant: 'destructive' });
      return;
    }

    setWireSubmitting(true);
    try {
      await addContactSubmission({
        name: formData.clientName.trim(),
        email: formData.clientEmail.trim().toLowerCase(),
        company: formData.clientCompany.trim() || undefined,
        service: `Demande virement — ${offer.label}`,
        message: `Demande de paiement par virement pour : ${offer.label} (${offer.totalPrice}€)\n\nBesoin : ${formData.clientDescription || 'Non précisé'}`,
      } as Parameters<typeof addContactSubmission>[0]);
      setWireSent(true);
    } catch {
      toast({ title: 'Erreur', description: 'Impossible d\'envoyer la demande.', variant: 'destructive' });
    } finally {
      setWireSubmitting(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copié !', description: 'Information copiée dans le presse-papiers.' });
  };

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Retour */}
        <Link
          href="/#services"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Choisir une autre offre
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Récapitulatif */}
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 pointer-events-none" />
            <div className="relative">
              <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">Récapitulatif de la commande</p>
              <h1 className="text-2xl font-bold text-white mb-1">{offer.label}</h1>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">Prix total</span>
                  <span className="text-white font-medium">{offer.totalPrice}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Acompte aujourd'hui (50%)</span>
                  <span className="text-2xl font-bold text-indigo-400">{depositAmount}€</span>
                </div>
                <div className="h-px bg-white/10" />
                <p className="text-xs text-white/40 italic">
                  Le solde de {depositAmount}€ sera réglé à la livraison du projet.
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
            <h2 className="text-lg font-semibold text-white mb-5">Vos informations</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="clientName" className="text-white/70 text-sm">Nom *</Label>
                  <Input
                    id="clientName"
                    placeholder="Jean Dupont"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/30 h-11"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="clientEmail" className="text-white/70 text-sm">Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="jean@entreprise.fr"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/30 h-11"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="clientCompany" className="text-white/70 text-sm">Entreprise (optionnel)</Label>
                <Input
                  id="clientCompany"
                  placeholder="Indigo SAS"
                  value={formData.clientCompany}
                  onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/30 h-11"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="clientDescription" className="text-white/70 text-sm">Décrivez votre besoin (optionnel)</Label>
                <Textarea
                  id="clientDescription"
                  placeholder="Mon objectif est de..."
                  value={formData.clientDescription}
                  onChange={(e) => setFormData({ ...formData, clientDescription: e.target.value })}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/30 resize-none"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div className="pt-2 space-y-3">
                <GradientButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 text-base"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Redirection en cours...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Payer l'acompte — {depositAmount}€
                    </span>
                  )}
                </GradientButton>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full border border-white/10 hover:bg-white/5 text-white/60 hover:text-white"
                  onClick={() => setShowWireModal(true)}
                  disabled={isSubmitting}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Je préfère payer par virement
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Modal virement */}
      <AnimatePresence>
        {showWireModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowWireModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md rounded-xl border border-white/10 bg-gray-900 p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="Instructions pour paiement par virement"
            >
              <button
                onClick={() => setShowWireModal(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              {wireSent ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Demande envoyée !</h3>
                  <p className="text-white/60 text-sm">
                    Nous vous contacterons sous 24h avec les instructions de virement et pour confirmer votre commande.
                  </p>
                  <Button className="mt-6 w-full" onClick={() => setShowWireModal(false)}>
                    Fermer
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-white mb-1">Paiement par virement</h3>
                  <p className="text-white/50 text-sm mb-5">
                    Acompte de {depositAmount}€ pour : {offer.label}
                  </p>

                  <div className="space-y-3 mb-6">
                    {[
                      { label: 'Bénéficiaire', value: 'Indigo Studio' },
                      { label: 'Montant', value: `${depositAmount}€` },
                      { label: 'Référence', value: `ACOMPTE-${offer.category.toUpperCase()}-${Date.now().toString().slice(-6)}` },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <p className="text-xs text-white/40">{row.label}</p>
                          <p className="text-sm font-medium text-white">{row.value}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(row.value)}
                          className="text-white/30 hover:text-white/70 transition-colors"
                          aria-label={`Copier ${row.label}`}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <p className="text-xs text-white/30 text-center">
                      IBAN communiqué par email après confirmation
                    </p>
                  </div>

                  <GradientButton
                    onClick={handleWireSubmit}
                    disabled={wireSubmitting}
                    className="w-full py-3"
                  >
                    {wireSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Envoi en cours...
                      </span>
                    ) : (
                      'Envoyer la demande de virement'
                    )}
                  </GradientButton>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
