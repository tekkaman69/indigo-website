'use client';

import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import GradientButton from '../ui/GradientButton';
import { useToast } from '@/hooks/use-toast';

const ContactCta = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation basique
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir tous les champs.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.message.length < 10) {
      toast({
        title: 'Message trop court',
        description: 'Votre message doit contenir au moins 10 caractères.',
        variant: 'destructive',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Email invalide',
        description: 'Veuillez saisir une adresse email valide.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          service: 'Contact rapide (homepage)',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'envoi');
      }

      toast({
        title: 'Message envoyé !',
        description: 'Nous vous répondrons dans les plus brefs délais.',
      });

      // Reset form
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-cta" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="bg-card/60 backdrop-blur-lg border-white/10 overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold tracking-tighter">Prêt à lancer votre projet ?</h2>
              <p className="mt-4 text-muted-foreground">
                Discutons de vos idées. Remplissez ce mini-formulaire et nous reviendrons vers vous en moins de 24h pour planifier un appel.
              </p>
            </div>
            <div className="p-8 md:p-12 bg-black/20">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  type="text"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-background/50 border-white/20 h-12"
                  disabled={isSubmitting}
                />
                <Input
                  type="email"
                  placeholder="Votre email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background/50 border-white/20 h-12"
                  disabled={isSubmitting}
                />
                <Textarea
                  placeholder="Votre message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-background/50 border-white/20"
                  disabled={isSubmitting}
                />
                <GradientButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </GradientButton>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ContactCta;
