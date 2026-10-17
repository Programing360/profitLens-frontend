import BenefitsSection from "@/src/components/landing/benefits-section";
import CTASection from "@/src/components/landing/cta-section";
import FeaturesSection from "@/src/components/landing/features-section";
import Footer from "@/src/components/landing/footer";
import HeroSection from "@/src/components/landing/hero-section";
import HowItWorks from "@/src/components/landing/how-it-works";
import Navbar from "@/src/components/landing/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <HeroSection />

      <FeaturesSection />
      <HowItWorks />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
