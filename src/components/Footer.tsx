import { Link } from 'react-router-dom';
import { Facebook, Instagram, MessageCircle, Mail, MapPin, Phone, Clock, Globe, Linkedin, Youtube } from 'lucide-react';
import { mapHref, navItemsFrom, socialHref, telHref, useSiteConfig, waHref, type SocialIcon } from '@/hooks/use-site-config';

const SOCIAL_ICONS: Record<SocialIcon, typeof Facebook> = {
  facebook: Facebook,
  instagram: Instagram,
  whatsapp: MessageCircle,
  email: Mail,
  linkedin: Linkedin,
  youtube: Youtube,
  site: Globe,
};

export default function Footer() {
  const { config } = useSiteConfig();
  const pageLinks = navItemsFrom(config);
  const contato = config.contact;
  const { brand, socials } = config;
  return (
    <footer className="bg-foreground text-background/70 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8 mb-12">
          {/* Marca */}
          <div className="md:col-span-4 space-y-5">
            <img src={brand.logo} alt="Engenheiro Edgar" width={180} height={60} loading="lazy" className="h-12 w-auto brightness-0 invert" />
            <p className="text-sm leading-relaxed max-w-xs">{brand.tagline}</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium tracking-wide px-3 py-1 rounded-full border border-background/20 text-background/80">{contato.crea}</span>
              <span className="text-xs font-medium tracking-wide px-3 py-1 rounded-full border border-background/20 text-background/80">{contato.creci}</span>
            </div>
            <div className="flex gap-2 pt-1">
              {socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon] ?? Globe;
                return (
                <a
                  key={s.label}
                  href={socialHref(s, contato)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-background/20 flex items-center justify-center text-background/80 hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
                );
              })}
            </div>
          </div>

          {/* Navegação */}
          <nav aria-label="Rodapé" className="md:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-background mb-5">Navegação</h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {pageLinks.map((p) => (
                <li key={p.label}>
                  {p.href.startsWith('/#') ? (
                    <a href={p.href} className="text-sm hover:text-primary transition-colors">{p.label}</a>
                  ) : (
                    <Link to={p.href} className="text-sm hover:text-primary transition-colors">{p.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Contato */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-background mb-5">Contato</h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a href={mapHref(contato)} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-primary transition-colors">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  <span className="leading-relaxed">{contato.endereco}</span>
                </a>
              </li>
              <li>
                <a href={waHref(contato)} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  <span>{contato.whatsapp}</span>
                </a>
              </li>
              <li>
                <a href={telHref(contato)} className="flex gap-3 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  <span>{contato.telefone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${contato.email}`} className="flex gap-3 hover:text-primary transition-colors break-all">
                  <Mail className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  <span>{contato.email}</span>
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                <span>{contato.horario}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-background/60">
          <p>© {new Date().getFullYear()} {brand.copyright}</p>
          {brand.credit && (
            <p>Desenvolvido com ❤️ pela <a href={brand.creditUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{brand.credit}</a></p>
          )}
        </div>
      </div>
    </footer>
  );
}
