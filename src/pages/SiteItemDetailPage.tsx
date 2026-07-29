import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, Phone, X, ZoomIn } from 'lucide-react';
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
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const images = item
    ? (Array.from(new Set([item.image, ...item.gallery].filter(Boolean))) as string[])
    : [];
  const current = images[index] ?? images[0] ?? null;

  const go = useCallback(
    (dir: number) => setIndex((i) => (images.length ? (i + dir + images.length) % images.length : 0)),
    [images.length],
  );

  useEffect(() => {
    setIndex(0);
    window.scrollTo({ top: 0 });
    if (item) {
      document.title = `${item.title} | ${cfg.label} - Engenheiro Edgar`;
    }
  }, [slug, item, cfg.label]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, go]);

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
            <article className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-10 items-start">
              <div className="lg:sticky lg:top-28">
                {current && (
                  <div className="group relative overflow-hidden rounded-xl border border-border bg-muted">
                    <img
                      src={current}
                      alt={`${item.title} — foto ${index + 1}`}
                      loading="eager"
                      className="w-full aspect-[4/3] object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.02]"
                      onClick={() => setLightbox(true)}
                    />
                    <button
                      type="button"
                      onClick={() => setLightbox(true)}
                      aria-label="Ampliar foto"
                      className="absolute top-3 right-3 rounded-full bg-background/85 backdrop-blur p-2 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => go(-1)}
                          aria-label="Foto anterior"
                          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/85 backdrop-blur p-2 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => go(1)}
                          aria-label="Próxima foto"
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/85 backdrop-blur p-2 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <span className="absolute bottom-3 left-3 rounded-full bg-foreground/70 text-background text-xs px-3 py-1">
                          {index + 1} / {images.length}
                        </span>
                      </>
                    )}
                  </div>
                )}

                {images.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-3">
                    {images.map((img, i) => (
                      <button
                        key={img}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Ver foto ${i + 1}`}
                        className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${
                          i === index
                            ? 'border-primary ring-2 ring-primary/25'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${item.title} — miniatura ${i + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
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

      {lightbox && current && (
        <div
          className="fixed inset-0 z-[100] bg-foreground/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            aria-label="Fechar"
            className="absolute top-5 right-5 text-background p-2"
            onClick={() => setLightbox(false)}
          >
            <X className="w-6 h-6" />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Foto anterior"
                className="absolute left-4 md:left-8 text-background p-3"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                type="button"
                aria-label="Próxima foto"
                className="absolute right-4 md:right-8 text-background p-3"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
          <img
            src={current}
            alt={`Foto ampliada ${index + 1}`}
            className="max-h-[88vh] max-w-[92vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="absolute bottom-5 text-background/80 text-sm">
            {index + 1} / {images.length}
          </span>
        </div>
      )}

      <Footer />
      <ChatWidget />
    </div>
  );
}