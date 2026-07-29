import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { contato, cursos, imoveis, marketplace } from '@/data/site-content';
import { useSiteItem, type SiteSection } from '@/hooks/use-site-items';

const CONFIG: Record<
  string,
  { section: SiteSection; label: string; base: string; fallback: typeof imoveis; msg: (t: string) => string }
> = {
  imoveis: {
    section: 'imoveis',
    label: 'Imóveis',
    base: '/imoveis',
    fallback: imoveis,
    msg: (t) => `Olá Edgar, gostaria de saber mais sobre o imóvel: ${t}`,
  },
  cursos: {
    section: 'cursos',
    label: 'Cursos',
    base: '/cursos',
    fallback: cursos,
    msg: (t) => `Olá Edgar, tenho interesse no curso: ${t}`,
  },
  marketplace: {
    section: 'marketplace',
    label: 'Marketplace',
    base: '/marketplace',
    fallback: marketplace,
    msg: (t) => `Olá Edgar, tenho interesse no anúncio: ${t}`,
  },
};

export default function SiteItemDetailPage({ sectionKey }: { sectionKey: keyof typeof CONFIG }) {
  const cfg = CONFIG[sectionKey];
  const { slug } = useParams<{ slug: string }>();
  const { item, isLoading } = useSiteItem(cfg.section, slug, cfg.fallback);
  const [active, setActive] = useState<string | null>(null);

  const images = item ? [item.image, ...item.gallery].filter(Boolean) as string[] : [];
  const current = active ?? images[0] ?? null;

  useEffect(() => {
    setActive(null);
    window.scrollTo({ top: 0 });
    if (item) {
      document.title = `${item.title} | ${cfg.label} - Engenheiro Edgar`;
    }
  }, [slug, item, cfg.label]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link
            to={`/#${cfg.section}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para {cfg.label}
          </Link>

          {isLoading ? (
            <p className="text-muted-foreground">Carregando…</p>
          ) : !item ? (
            <div className="py-16 text-center">
              <h1 className="font-heading text-3xl mb-3">Não encontrado</h1>
              <p className="text-muted-foreground">Este item não está mais disponível.</p>
            </div>
          ) : (
            <article className="grid md:grid-cols-2 gap-10">
              <div>
                {current && (
                  <img
                    src={current}
                    alt={item.title}
                    className="w-full aspect-video object-cover rounded-lg border border-border"
                  />
                )}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {images.map((img) => (
                      <button
                        key={img}
                        onClick={() => setActive(img)}
                        className={`aspect-video overflow-hidden rounded border transition-all ${
                          img === current ? 'border-primary' : 'border-border opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={item.title} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h1 className="font-heading text-3xl md:text-4xl mb-5">{item.title}</h1>
                <p className="text-[15px] text-foreground/80 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-3 mt-8">
                  {item.link_url && (
                    <a
                      href={item.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-[3px] text-sm uppercase tracking-wide hover:brightness-95 transition-all"
                    >
                      {item.cta_label || 'Acessar link'}
                    </a>
                  )}
                  <a
                    href={`${contato.whatsappHref}?text=${encodeURIComponent(cfg.msg(item.title))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-[3px] text-sm uppercase tracking-wide hover:bg-primary/10 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                  <a
                    href={contato.telefoneHref}
                    className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-[3px] text-sm uppercase tracking-wide hover:bg-muted transition-all"
                  >
                    <Phone className="w-4 h-4" /> Ligar
                  </a>
                </div>
              </div>
            </article>
          )}
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}