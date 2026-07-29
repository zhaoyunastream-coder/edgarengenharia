import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import ImoveisSection from '@/components/ImoveisSection';
import CursosSection from '@/components/CursosSection';
import MarketplaceSection from '@/components/MarketplaceSection';
import VoceSabiaSection from '@/components/VoceSabiaSection';
import AboutSection from '@/components/AboutSection';
import BlogPreviewSection from '@/components/BlogPreviewSection';
import ContactCTASection from '@/components/ContactCTASection';
import LinksUteisSection from '@/components/LinksUteisSection';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <ImoveisSection />
        <CursosSection />
        <MarketplaceSection />
        <VoceSabiaSection />
        <AboutSection />
        <BlogPreviewSection />
        <ContactCTASection />
        <LinksUteisSection />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
