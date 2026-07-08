import HeroFunnel from '@/components/home/funnel/HeroFunnel';
import ProblemFunnel from '@/components/home/funnel/ProblemFunnel';
import ProjectShowcase from '@/components/showcase/ProjectShowcase';
import AboutFounder from '@/components/home/funnel/AboutFounder';
import TestimonialsFunnel from '@/components/home/funnel/TestimonialsFunnel';
import AcquisitionPacks from '@/components/home/funnel/AcquisitionPacks';
import FAQFunnel from '@/components/home/funnel/FAQFunnel';
import FinalCTAFunnel from '@/components/home/funnel/FinalCTAFunnel';
import { WhatsAppFAB, FunnelDivider } from '@/components/home/funnel/WhatsApp';

export default function Home() {
  return (
    // Body noir : le hero a des coins inférieurs arrondis qui révèlent ce
    // noir en dessous (bevel exactement comme la référence ACA).
    <div className="relative text-white overflow-x-hidden bg-[#050509]">
      {/* Hero avec sa bande lumineuse colorée + coins bas arrondis */}
      <HeroFunnel />

      {/* Le reste du funnel — fond posé, sous le hero */}
      <div className="relative bg-[#070815]">
        <FunnelDivider />
        <ProblemFunnel />
        <FunnelDivider />
        <ProjectShowcase />
        <FunnelDivider />
        <AboutFounder />
        <FunnelDivider />
        <TestimonialsFunnel />
        <FunnelDivider />
        <AcquisitionPacks />
        <FunnelDivider />
        <FAQFunnel />
        <FinalCTAFunnel />
      </div>

      <WhatsAppFAB />
    </div>
  );
}
