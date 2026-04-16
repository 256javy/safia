import HeroSection from "@/features/landing/HeroSection";
import TrustBar from "@/features/landing/TrustBar";
import ModulesPreview from "@/features/landing/ModulesPreview";
import HowItWorks from "@/features/landing/HowItWorks";
import SimulatorTeaser from "@/features/landing/SimulatorTeaser";
import GamificationPreview from "@/features/landing/GamificationPreview";
import NewsletterSection from "@/features/landing/NewsletterSection";
import Footer from "@/features/landing/Footer";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <ModulesPreview />
      <HowItWorks />
      <SimulatorTeaser />
      <GamificationPreview />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
