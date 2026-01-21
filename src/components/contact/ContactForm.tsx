'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '../ui/card';
import GradientButton from '../ui/GradientButton';
import { addContactSubmission } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  company: z.string().optional(),
  email: z.string().email('Adresse email invalide.'),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères.'),
});

const serviceOptions = [
  'Automatisations',
  'Créations vidéo',
  'Contenu réseaux sociaux',
  'Créations graphiques',
  'Identité / Branding',
  'Autre',
];

const budgetOptions = [
  '< 1 000€',
  '1 000€ - 5 000€',
  '5 000€ - 10 000€',
  '> 10 000€',
];

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'envoi');
      }

      toast({
        title: 'Message envoyé !',
        description: 'Nous vous répondrons dans les plus brefs délais.',
      });

      form.reset();
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
  }

  return (
    <Card className="p-6 md:p-8">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="h-11 bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entreprise (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} className="h-11 bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} className="h-11 bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Besoin</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-background/50">
                          <SelectValue placeholder="Sélectionnez un service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceOptions.map(opt => (
                           <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (optionnel)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-background/50">
                          <SelectValue placeholder="Estimez votre budget" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {budgetOptions.map(opt => (
                           <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez votre projet en quelques mots..."
                      className="min-h-[120px] bg-background/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-right">
              <GradientButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer votre message'}
              </GradientButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
