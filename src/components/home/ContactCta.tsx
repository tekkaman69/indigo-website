import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import GradientButton from '../ui/GradientButton';

const ContactCta = () => {
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
              <form className="flex flex-col gap-4">
                <Input type="text" placeholder="Votre nom" className="bg-background/50 border-white/20 h-12" />
                <Input type="email" placeholder="Votre email" className="bg-background/50 border-white/20 h-12" />
                <Textarea placeholder="Votre message..." className="bg-background/50 border-white/20" />
                <GradientButton type="submit">Envoyer le message</GradientButton>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ContactCta;
