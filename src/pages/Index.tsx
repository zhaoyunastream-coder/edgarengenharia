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
import { useSiteConfig, textOf, type SectionId } from '@/hooks/use-site-config';

const Index = () => {
  const { config } = useSiteConfig();

  const render = (id: SectionId) => {
    const title = textOf(config, id);
    switch (id) {
      case 'hero':
        return <HeroSection key={id} title={title} subtitle={textOf(config, 'hero', 'subtitle')} />;
      case 'servicos':
        return <ServicesSection key={id} title={title} />;
      case 'imoveis':
        return <ImoveisSection key={id} title={title} />;
      case 'cursos':
        return <CursosSection key={id} title={title} />;
      case 'marketplace':
        return <MarketplaceSection key={id} title={title} />;
      case 'vocesabia':
        return <VoceSabiaSection key={id} title={title} />;
      case 'sobre':
        return <AboutSection key={id} title={title} />;
      case 'blog':
        return <BlogPreviewSection key={id} title={title} />;
      case 'contato':
        return <ContactCTASection key={id} title={title} />;
      case 'links':
        return <LinksUteisSection key={id} title={title} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{config.layout.filter((s) => s.visible).map((s) => render(s.id))}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
