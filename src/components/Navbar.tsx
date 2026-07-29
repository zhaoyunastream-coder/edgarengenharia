import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, MapPin, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { contato, logoImage } from '@/data/site-content';

const navLinks = [
  { label: 'Início', href: '/#inicio' },
  { label: 'Serviços', href: '/#servicos' },
  { label: 'Imóveis', href: '/#imoveis' },
  { label: 'Cursos', href: '/#cursos' },
  { label: 'Marketplace', href: '/#marketplace' },
  { label: 'Você sabia?', href: '/#voce-sabia' },
  { label: 'Sobre', href: '/#sobre' },
  { label: 'Contato', href: '/#contato' },
  { label: 'Blog', href: '/blog' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (!href.startsWith('/#')) return;
    const id = href.replace('/#', '');
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  const quickIcons = (
    <>
      <a href={contato.mapa} target="_blank" rel="noopener noreferrer" aria-label="Ver endereço no mapa" className="text-muted-foreground hover:text-primary transition-colors">
        <MapPin className="w-[18px] h-[18px]" />
      </a>
      <a href={`mailto:${contato.email}`} aria-label="Enviar e-mail" className="text-muted-foreground hover:text-primary transition-colors">
        <Mail className="w-[18px] h-[18px]" />
      </a>
      <a href={contato.telefoneHref} aria-label="Ligar" className="text-muted-foreground hover:text-primary transition-colors">
        <Phone className="w-[18px] h-[18px]" />
      </a>
    </>
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-background transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_1px_10px_rgba(0,0,0,0.10)]' : 'shadow-[0_1px_4px_rgba(0,0,0,0.06)]'
        }`}
      >
        <div className="container mx-auto px-4 h-[70px] flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center shrink-0" aria-label="Página inicial">
            <img
              src={logoImage}
              alt="Edgar Alexandre Kmiecik — Engenheiro Civil"
              width={116}
              height={58}
              className="h-[52px] w-auto object-contain"
            />
          </Link>

          <div className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) =>
              link.href.startsWith('/#') ? (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-[15px] uppercase tracking-wide text-foreground/80 hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-[15px] uppercase tracking-wide text-foreground/80 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ),
            )}
            <div className="flex items-center gap-3 pl-2">{quickIcons}</div>
            <Link to="/admin" title="Área do Admin" aria-label="Área do Admin" className="text-muted-foreground/40 hover:text-muted-foreground transition-colors">
              <LogIn className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center gap-4 xl:hidden">
            {quickIcons}
            <button className="text-foreground" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-xs bg-card z-50 p-6 flex flex-col overflow-y-auto"
            >
              <button onClick={() => setMobileOpen(false)} aria-label="Fechar menu" className="self-end text-foreground mb-6">
                <X className="w-6 h-6" />
              </button>
              <div className="flex flex-col divide-y divide-border">
                {navLinks.map((link) =>
                  link.href.startsWith('/#') ? (
                    <button
                      key={link.label}
                      onClick={() => handleNavClick(link.href)}
                      className="py-3 text-base uppercase tracking-wide text-foreground hover:text-primary transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="py-3 text-base uppercase tracking-wide text-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
              <a
                href={contato.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground px-5 py-3 rounded-[3px] text-center font-semibold mt-6"
              >
                Falar no WhatsApp
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
