import HeroSection from "@/features/landing/HeroSection";
import TrustBar from "@/features/landing/TrustBar";
import SimulatorTeaser from "@/features/landing/SimulatorTeaser";
import FollowSection from "@/features/landing/FollowSection";
import Footer from "@/features/landing/Footer";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <SimulatorTeaser />
      <FollowSection />
      <Footer />
    </main>
  );
}
