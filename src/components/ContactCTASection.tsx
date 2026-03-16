import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

export default function ContactCTASection() {
  const { ref, controls, variants } = useScrollReveal();

  return (
    <section className="py-20 relative bg-primary/10 border-y border-primary/20">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={variants} className="text-center">
          <h2 className="text-4xl md:text-5xl font-heading mb-4">
            Pronto para começar <span className="text-gradient">seu projeto?</span>
          </h2>
          <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
            Entre em contato e solicite um orçamento sem compromisso.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="https://wa.me/5554997014995"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </a>
            <a
              href="mailto:contato@eakengenharia.com.br"
              className="border border-border text-foreground px-6 py-3 rounded-md font-semibold flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-all"
            >
              <Mail className="w-5 h-5" /> E-mail
            </a>
            <a
              href="tel:+5554999999999"
              className="border border-border text-foreground px-6 py-3 rounded-md font-semibold flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-all"
            >
              <Phone className="w-5 h-5" /> Telefone
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            Carazinho, RS — Atendimento presencial e remoto
          </div>
        </motion.div>
      </div>
    </section>
  );
}
