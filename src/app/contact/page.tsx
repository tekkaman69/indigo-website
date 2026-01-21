import ContactForm from '@/components/contact/ContactForm';
import Balancer from 'react-wrap-balancer';

export const metadata = {
  title: "Contact - Indigo",
  description: "Discutons de votre projet. Prenez contact avec notre équipe pour transformer vos idées en réalité.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-3xl">
       <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          <Balancer>Contactez-nous</Balancer>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          <Balancer>
            Une idée ? Un projet ? Ou simplement envie de dire bonjour ? Remplissez le formulaire ci-dessous et nous vous répondrons sous 24 heures.
          </Balancer>
        </p>
      </div>
      <ContactForm />
    </div>
  );
}
