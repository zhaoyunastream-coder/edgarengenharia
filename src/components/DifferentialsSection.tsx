import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Box, Users, Headphones, DollarSign } from 'lucide-react';

const features = [
  {
    icon: Box,
    title: 'Tecnologia BIM',
    desc: 'Utilizo Building Information Modeling para integrar todas as disciplinas do projeto, reduzindo erros e retrabalhos em obra.',
  },
  {
    icon: Users,
    title: 'Experiência Multidisciplinar',
    desc: 'Formação em Contabilidade, Avaliação Imobiliária e Engenharia Civil — uma visão completa do seu investimento.',
  },
  {
    icon: Headphones,
    title: 'Atendimento Personalizado',
    desc: 'Cada projeto é único. Ofereço acompanhamento próximo do início ao fim, com comunicação clara e acessível.',
  },
  {
    icon: DollarSign,
    title: 'Preço Justo e Transparente',
    desc: 'Orçamentos detalhados sem surpresas. Você sabe exatamente o que está pagando e por quê.',
  },
];

export default function DifferentialsSection() {
  const { ref, controls, variants } = useScrollReveal();

  return (
    <section id="diferenciais" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={variants}>
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Diferenciais</p>
            <h2 className="text-4xl md:text-5xl font-heading">
              Por que escolher a <span className="text-gradient">EAK</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex gap-5 p-6 bg-card border border-border rounded-lg"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
