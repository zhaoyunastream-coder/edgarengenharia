import { Link } from 'react-router-dom';
import { Facebook, Instagram, MessageCircle, Mail, MapPin } from 'lucide-react';
import { contato, logoImage } from '@/data/site-content';

const pageLinks = [
  { label: 'Início', href: '/#inicio' },
  { label: 'Serviços', href: '/#servicos' },
  { label: 'Imóveis', href: '/#imoveis' },
  { label: 'Cursos', href: '/#cursos' },
  { label: 'Marketplace', href: '/#marketplace' },
  { label: 'Você sabia ???', href: '/#voce-sabia' },
  { label: 'Sobre', href: '/#sobre' },
  { label: 'Contato', href: '/#contato' },
  { label: 'Links Úteis', href: '/#links-uteis' },
  { label: 'Blog', href: '/blog' },
];

const socials = [
  { icon: Facebook, href: 'https://www.facebook.com/edgarkmiecik1', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/engenheiroedgar/', label: 'Instagram' },
  { icon: MessageCircle, href: contato.whatsappHref, label: 'WhatsApp' },
  { icon: Mail, href: `mailto:${contato.email}`, label: 'E-mail' },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80 py-14">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <img src={logoImage} alt="Engenheiro Edgar" width={180} height={60} loading="lazy" className="h-12 w-auto mb-4 brightness-0 invert" />
            <p className="text-sm leading-relaxed">
              Engenharia Civil, corretagem de imóveis e cursos em Carazinho/RS e região.
            </p>
            <p className="text-sm mt-3">{contato.crea} &nbsp;|&nbsp; {contato.creci}</p>
          </div>

          <nav aria-label="Rodapé">
            <h3 className="text-base font-semibold text-background mb-4">Navegação</h3>
            <ul className="grid grid-cols-2 gap-y-2">
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

          <div>
            <h3 className="text-base font-semibold text-background mb-4">Contato</h3>
            <a href={contato.mapa} target="_blank" rel="noopener noreferrer" className="flex gap-2 text-sm hover:text-primary transition-colors">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              {contato.endereco}
            </a>
            <p className="text-sm mt-2">{contato.whatsapp}</p>
            <p className="text-sm">{contato.email}</p>
            <p className="text-sm mt-2">{contato.horario}</p>

            <div className="flex gap-3 mt-5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-background/30 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-6 text-center text-sm space-y-1">
          <p>© {new Date().getFullYear()} Engenheiro Edgar. Todos os direitos reservados.</p>
          <p>Desenvolvido com ❤️ pela <a href="https://agenciafw.com.br/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">agenciafw.com.br</a></p>
        </div>
      </div>
    </footer>
  );
}
