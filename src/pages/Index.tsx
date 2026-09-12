import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProblemsSection from "@/components/ProblemsSection";
import SolutionSection from "@/components/SolutionSection";
import FeaturesSection from "@/components/FeaturesSection";
import BenefitsSection from "@/components/BenefitsSection";
import ProcessSection from "@/components/ProcessSection";
import CredibilitySection from "@/components/CredibilitySection";
import FinalCTA from "@/components/FinalCTA";
import CookieBanner from "@/components/CookieBanner";
import PrivacyFooter from "@/components/PrivacyFooter";

const Index = () => {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        <div id="home">
          <Hero />
        </div>
        <div id="problems">
          <ProblemsSection />
        </div>
        <div id="solution">
          <SolutionSection />
        </div>
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="benefits">
          <BenefitsSection />
        </div>
        <div id="process">
          <ProcessSection />
        </div>
        <div id="credibility">
          <CredibilitySection />
        </div>
        <div id="final-cta">
          <FinalCTA />
        </div>
      </main>
      <PrivacyFooter />
      <CookieBanner />
    </>
  );
};

export default Index;
