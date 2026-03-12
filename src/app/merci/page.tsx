import Link from 'next/link';
import { CheckCircle, Mail, Calendar, FileText } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import { Button } from '@/components/ui/button';

export default function MerciPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4">
      <div className="w-full max-w-lg text-center space-y-8">

        {/* Icône succès */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl scale-150" />
            <div className="relative w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </div>
        </div>

        {/* Titre */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Paiement confirmé
          </h1>
          <p className="text-white/60 text-lg">
            Merci pour votre confiance. Votre projet démarre.
          </p>
        </div>

        {/* Prochaines étapes */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-left space-y-4">
          <p className="text-xs uppercase tracking-widest text-indigo-400 text-center mb-2">Prochaines étapes</p>

          {[
            {
              icon: Mail,
              step: '01',
              title: 'Email de confirmation',
              description: 'Vous allez recevoir un récapitulatif dans les prochaines minutes.',
            },
            {
              icon: Calendar,
              step: '02',
              title: 'Appel de briefing sous 48h',
              description: 'Nous vous contacterons pour planifier un call de démarrage.',
            },
            {
              icon: FileText,
              step: '03',
              title: 'Questionnaire de briefing',
              description: 'Un questionnaire détaillé vous sera envoyé pour cadrer le projet.',
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-white/50 mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <GradientButton href="/" className="flex-1 py-3">
            Retour à l'accueil
          </GradientButton>
          <Button asChild variant="ghost" className="flex-1 border border-white/10 hover:bg-white/5 text-white/70">
            <Link href="/portfolio">Voir notre portfolio</Link>
          </Button>
        </div>

        <p className="text-xs text-white/30">
          Une question ?{' '}
          <a href="mailto:contact@indigo-studio.fr" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            contact@indigo-studio.fr
          </a>
        </p>
      </div>
    </div>
  );
}
