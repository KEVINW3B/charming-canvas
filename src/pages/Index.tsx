import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { BankingStoriesSection } from "@/components/BankingStoriesSection";
import { MembershipSection } from "@/components/MembershipSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <BankingStoriesSection />
        <MembershipSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
