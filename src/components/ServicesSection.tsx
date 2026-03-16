import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import {
  Building2, Layers, FileCheck, Calculator, LandPlot, Ruler,
  Building, Flame, Accessibility, Search, Zap, Stethoscope
} from 'lucide-react';

const services = [
  { icon: Building2, title: 'Projetos e Execução de Obras', desc: 'Acompanhamento, gerenciamento e execução completa de obras residenciais, comerciais e industriais.' },
  { icon: Layers, title: 'Compatibilização BIM', desc: 'Integração de projetos multidisciplinares com tecnologia BIM para evitar conflitos em obra.' },
  { icon: FileCheck, title: 'Regularização de Imóveis', desc: 'Adequação documental e técnica para regularizar seu imóvel junto aos órgãos competentes.' },
  { icon: Calculator, title: 'INSS de Obras', desc: 'Cálculo e redução legal do INSS sobre obras, garantindo economia e conformidade fiscal.' },
  { icon: LandPlot, title: 'Desmembramento e Unificação', desc: 'Processos de desmembramento e unificação de terrenos com agilidade e segurança jurídica.' },
  { icon: Ruler, title: 'Cálculos Estruturais', desc: 'Dimensionamento estrutural seguro e otimizado para concreto armado, aço e madeira.' },
  { icon: Building, title: 'Incorporação de Imóveis', desc: 'Assessoria completa para incorporação imobiliária, do memorial à entrega das unidades.' },
  { icon: Flame, title: 'PPCI', desc: 'Projetos de Prevenção Contra Incêndio conforme normas do Corpo de Bombeiros.' },
  { icon: Accessibility, title: 'Projetos de Acessibilidade', desc: 'Adequação de edificações às normas de acessibilidade universal (NBR 9050).' },
  { icon: Search, title: 'Perícias e Laudos', desc: 'Laudos técnicos, vistorias e perícias na construção civil com embasamento normativo.' },
  { icon: Zap, title: 'Projetos Elétricos', desc: 'Projetos elétricos residenciais e comerciais em conformidade com a NBR 5410.' },
  { icon: Stethoscope, title: 'Engenharia Diagnóstica', desc: 'Inspeção predial, diagnóstico de patologias e planos de manutenção preventiva.' },
];

export default function ServicesSection() {
  const { ref, controls, variants } = useScrollReveal();

  return (
    <section id="servicos" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={variants}>
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Serviços</p>
            <h2 className="text-4xl md:text-5xl font-heading">
              O que posso fazer <span className="text-gradient">por você</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="group bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:glow-amber transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl mb-2 text-foreground">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
