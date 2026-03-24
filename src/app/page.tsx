import Hero from '@/components/home/Hero';
import ComparisonSection from '@/components/home/ComparisonSection';
import DualProcess from '@/components/home/DualProcess';
import ServicesSection from '@/components/home/ServicesSection';
import PortfolioSection from '@/components/home/PortfolioSection';
import WebPortfolioSection from '@/components/home/WebPortfolioSection';
import Testimonials from '@/components/home/Testimonials';
import FAQSection from '@/components/home/FAQSection';
import FinalCTASection from '@/components/home/FinalCTASection';
import Template from './template';

export default function Home() {
  return (
    <Template>
      <div className="flex flex-col items-center">
        <Hero />
        <ComparisonSection />
        <DualProcess />
        <ServicesSection />
        <PortfolioSection />
        <WebPortfolioSection />
        <Testimonials />
        <FAQSection />
        <FinalCTASection />
      </div>
    </Template>
  );
}
