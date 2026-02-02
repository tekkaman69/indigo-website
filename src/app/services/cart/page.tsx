'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import Template from '@/app/template';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';
import type { FormQuestion } from '@/types/marketplace';

type Step = 'cart' | 'questions' | 'customer';

export default function CartPage() {
  const router = useRouter();
  const { items, total, removeItem, updateQuantity, updateAnswers } = useCart();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('cart');
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    return (
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-8">
              Découvrez nos services pour commencer
            </p>
            <Button onClick={() => router.push('/services')}>
              Voir nos services
            </Button>
          </div>
        </div>
      </Template>
    );
  }

  const currentItem = items[currentServiceIndex];
  const hasQuestions = currentItem?.service.formSchema.length > 0;

  const handleAnswerChange = (questionId: string, value: any) => {
    const newAnswers = { ...currentItem.answers, [questionId]: value };
    updateAnswers(currentItem.service.id, newAnswers);
  };

  const validateCurrentStep = (): boolean => {
    if (step === 'questions' && hasQuestions) {
      const requiredQuestions = currentItem.service.formSchema.filter((q) => q.required);
      for (const question of requiredQuestions) {
        const answer = currentItem.answers[question.id];
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
          toast({
            title: 'Champs requis',
            description: `Veuillez répondre à la question: ${question.label}`,
            variant: 'destructive',
          });
          return false;
        }
      }
    }

    if (step === 'customer') {
      if (!customerName.trim() || !customerEmail.trim()) {
        toast({
          title: 'Informations requises',
          description: 'Veuillez renseigner votre nom et email',
          variant: 'destructive',
        });
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        toast({
          title: 'Email invalide',
          description: 'Veuillez saisir une adresse email valide',
          variant: 'destructive',
        });
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (step === 'cart') {
      // Check if any service has questions
      const servicesWithQuestions = items.filter((item) => item.service.formSchema.length > 0);
      if (servicesWithQuestions.length > 0) {
        setStep('questions');
        setCurrentServiceIndex(0);
      } else {
        setStep('customer');
      }
    } else if (step === 'questions') {
      // Move to next service or to customer info
      if (currentServiceIndex < items.length - 1) {
        const nextIndex = currentServiceIndex + 1;
        const nextItem = items[nextIndex];
        if (nextItem.service.formSchema.length > 0) {
          setCurrentServiceIndex(nextIndex);
        } else {
          // Skip services without questions
          let idx = nextIndex + 1;
          while (idx < items.length && items[idx].service.formSchema.length === 0) {
            idx++;
          }
          if (idx < items.length) {
            setCurrentServiceIndex(idx);
          } else {
            setStep('customer');
          }
        }
      } else {
        setStep('customer');
      }
    }
  };

  const handleBack = () => {
    if (step === 'customer') {
      // Check if there are questions
      const servicesWithQuestions = items.filter((item) => item.service.formSchema.length > 0);
      if (servicesWithQuestions.length > 0) {
        setStep('questions');
        setCurrentServiceIndex(items.length - 1);
      } else {
        setStep('cart');
      }
    } else if (step === 'questions') {
      if (currentServiceIndex > 0) {
        setCurrentServiceIndex(currentServiceIndex - 1);
      } else {
        setStep('cart');
      }
    } else {
      router.push('/services');
    }
  };

  const handleCheckout = async () => {
    if (!validateCurrentStep()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            serviceId: item.service.id,
            serviceTitle: item.service.title,
            price: item.service.price,
            quantity: item.quantity,
            answers: item.answers,
          })),
          customerName,
          customerEmail,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la commande');
      }

      // Redirect to LemonSqueezy checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  const renderQuestion = (question: FormQuestion) => {
    const value = currentItem.answers[question.id];

    switch (question.type) {
      case 'short_text':
        return (
          <Input
            placeholder={question.placeholder}
            value={value || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          />
        );
      case 'long_text':
        return (
          <Textarea
            placeholder={question.placeholder}
            value={value || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            rows={4}
          />
        );
      case 'select':
        return (
          <Select value={value || ''} onValueChange={(val) => handleAnswerChange(question.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'multiple_select':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => {
              const checked = Array.isArray(value) && value.includes(option);
              return (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${option}`}
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      const current = Array.isArray(value) ? value : [];
                      const updated = isChecked
                        ? [...current, option]
                        : current.filter((v) => v !== option);
                      handleAnswerChange(question.id, updated);
                    }}
                  />
                  <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                </div>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Template>
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            {step === 'cart' && 'Votre Panier'}
            {step === 'questions' && 'Informations Service'}
            {step === 'customer' && 'Vos Coordonnées'}
          </h1>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`h-2 flex-1 rounded ${step === 'cart' ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-2 flex-1 rounded ${step === 'questions' ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-2 flex-1 rounded ${step === 'customer' ? 'bg-primary' : 'bg-muted'}`} />
          </div>

          {/* Step: Cart Review */}
          {step === 'cart' && (
            <Card>
              <CardHeader>
                <CardTitle>Résumé de votre commande</CardTitle>
                <CardDescription>
                  Vérifiez les services sélectionnés
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.service.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.service.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.service.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {(item.service.price * item.quantity).toFixed(2)} €
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.service.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 border-t text-xl font-bold">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Questions */}
          {step === 'questions' && currentItem && (
            <Card>
              <CardHeader>
                <CardTitle>{currentItem.service.title}</CardTitle>
                <CardDescription>
                  Service {currentServiceIndex + 1} sur {items.length} - Veuillez répondre aux questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentItem.service.formSchema.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <Label>
                      {question.label}
                      {question.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    {renderQuestion(question)}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Step: Customer Info */}
          {step === 'customer' && (
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
                <CardDescription>
                  Nous utiliserons ces informations pour le suivi de votre commande
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nom complet <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Votre nom"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-xl font-bold mb-4">
                    <span>Total à payer</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Vous serez redirigé vers notre page de paiement sécurisée
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            {step === 'customer' ? (
              <Button onClick={handleCheckout} disabled={isProcessing} size="lg">
                {isProcessing ? 'Traitement...' : 'Procéder au paiement'}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Suivant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Template>
  );
}
