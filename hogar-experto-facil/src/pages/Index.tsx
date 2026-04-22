
import SearchHero from '@/components/SearchHero';
import ServiceCategories from '@/components/ServiceCategories';
import StatsSection from '@/components/StatsSection';
import FeaturedExpertosSection from '@/components/FeaturedExpertosSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import CtaSection from '@/components/CtaSection';

const Index = () => {
  return (
    <div className="bg-background">
      <SearchHero />
      <ServiceCategories />
      <FeaturedExpertosSection />
      <StatsSection />
      <HowItWorksSection />
      <CtaSection />
    </div>
  );
};

export default Index;
