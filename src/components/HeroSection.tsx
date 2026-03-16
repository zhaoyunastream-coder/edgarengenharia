import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/use-count-up';
import { BadgeCheck, ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-4xl md:text-5xl text-primary">
        {count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

export default function HeroSection() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const title = "Engenharia que Transforma Projetos em Realidade";
  const words = title.split(' ');

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center blueprint-grid-dense overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* CREA Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 mb-8"
          >
            <BadgeCheck className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">CREA-RS 243302</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6"
          >
            {words.map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block mr-3">
                {['Transforma', 'Realidade'].includes(word) ? (
                  <span className="text-gradient">{word}</span>
                ) : word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Do projeto à execução. Do cálculo à regularização. Soluções completas em Engenharia Civil em Carazinho/RS e região.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <button
              onClick={() => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })}
              className="group border border-border text-foreground px-8 py-3 rounded-md font-semibold flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-all"
            >
              Ver Serviços
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://wa.me/5554997014995"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Falar no WhatsApp
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-3 gap-8 max-w-xl mx-auto"
          >
            <StatItem value={15} suffix="+" label="Anos de Experiência" />
            <StatItem value={200} suffix="+" label="Projetos Entregues" />
            <StatItem value={100} suffix="%" label="Regularizados" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
