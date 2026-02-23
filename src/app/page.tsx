import Hero from '@/components/landing/Hero';
import Concept from '@/components/landing/Concept';
import EmotionalDetox from '@/components/landing/EmotionalDetox';
import TrustSignals from '@/components/landing/TrustSignals';
import Features from '@/components/landing/Features';
import TreatmentProcess from '@/components/landing/TreatmentProcess';
import ZoningBanner from '@/components/landing/ZoningBanner';
import Pricing from '@/components/landing/Pricing';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import TherapistsPreview from '@/components/landing/TherapistsPreview';
import ServiceArea from '@/components/landing/ServiceArea';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background-dark text-text-cream overflow-x-hidden">
      <Hero />
      <Concept />
      <EmotionalDetox />
      <TrustSignals />
      <Features />
      <TreatmentProcess />
      <ZoningBanner />
      <Pricing />
      <ServiceArea />
      <HowItWorks />
      <Testimonials />
      <TherapistsPreview />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
