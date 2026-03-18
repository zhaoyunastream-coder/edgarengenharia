import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';

const serviceLinks = [
  'Projetos e Execução', 'Compatibilização BIM', 'Regularização de Imóveis',
  'INSS de Obras', 'Cálculos Estruturais', 'PPCI',
];

const pageLinks = [
  { label: 'Início', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contato', href: '/contato' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-1 mb-4">
              <span className="font-heading text-3xl text-primary">ENGENHEIRO</span>
              <span className="font-heading text-3xl text-foreground">Edgar</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Soluções completas em Engenharia Civil em Carazinho/RS e região.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <BadgeCheck className="w-4 h-4 text-primary" />
              CREA-RS 243302
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-lg mb-4">Serviços</h4>
            <ul className="space-y-2">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h4 className="font-heading text-lg mb-4">Páginas</h4>
            <ul className="space-y-2">
              {pageLinks.map((p) => (
                <li key={p.label}>
                  <Link to={p.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{p.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading text-lg mb-4">Redes Sociais</h4>
            <ul className="space-y-2">
              <li><a href="https://wa.me/5554999787256" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground space-y-1">
          <p>© {new Date().getFullYear()} Engenheiro Edgar. Todos os direitos reservados.</p>
          <p>Desenvolvido com ❤️ pela <a href="https://agenciafw.com.br/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">agenciafw.com.br</a></p>
        </div>
      </div>
    </footer>
  );
}
