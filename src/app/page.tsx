import Hero from '@/components/home/Hero';
import ProblemSection from '@/components/home/ProblemSection';
import MethodSection from '@/components/home/MethodSection';
import ServicesSection from '@/components/home/ServicesSection';
import PortfolioSection from '@/components/home/PortfolioSection';
import Testimonials from '@/components/home/Testimonials';
import FAQSection from '@/components/home/FAQSection';
import FinalCTASection from '@/components/home/FinalCTASection';
import Template from './template';

export default function Home() {
  return (
    <Template>
      <div className="flex flex-col items-center">
        <Hero />
        <ProblemSection />
        <MethodSection />
        <ServicesSection />
        <PortfolioSection />
        <Testimonials />
        <FAQSection />
        <FinalCTASection />
      </div>
    </Template>
  );
}
