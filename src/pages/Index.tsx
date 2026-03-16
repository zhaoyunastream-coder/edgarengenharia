import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import DifferentialsSection from '@/components/DifferentialsSection';
import BlogPreviewSection from '@/components/BlogPreviewSection';
import ContactCTASection from '@/components/ContactCTASection';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <DifferentialsSection />
      <BlogPreviewSection />
      <ContactCTASection />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
