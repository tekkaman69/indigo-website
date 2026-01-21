import ContactCta from '@/components/home/ContactCta';
import Hero from '@/components/home/Hero';
import FeaturedWork from '@/components/home/FeaturedWork';
import FounderSection from '@/components/home/FounderSection';
import Process from '@/components/home/Process';
import Services from '@/components/home/Services';
import Testimonials from '@/components/home/Testimonials';
import Template from './template';

export default function Home() {
  return (
    <Template>
      <div className="flex flex-col items-center">
        <Hero />
        <Services />
        <FeaturedWork />
        <FounderSection />
        <Process />
        <Testimonials />
        <ContactCta />
      </div>
    </Template>
  );
}
