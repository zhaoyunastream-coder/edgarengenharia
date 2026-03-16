import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { GraduationCap, Calendar } from 'lucide-react';

const education = [
  { year: '2004', title: 'Ciências Contábeis — UPF' },
  { year: '2009', title: 'Pós em Gestão de Pessoas' },
  { year: '2011', title: 'Técnico em Transações Imobiliárias' },
  { year: '2012', title: 'Avaliação de Imóveis' },
  { year: '2019', title: 'Engenharia Civil — Ulbra' },
  { year: '2021', title: 'Pós em Eng. e Segurança do Trabalho' },
  { year: '2022', title: 'Pós em Estruturas de Concreto Armado' },
];

const softwares = ['AutoCAD', 'SketchUp', 'Revit', 'MS Project', 'Navisworks', 'Eberick'];

export default function AboutSection() {
  const { ref, controls, variants } = useScrollReveal();

  return (
    <section id="sobre" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={variants}>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Image Side */}
            <div className="relative">
              <div className="aspect-[4/5] bg-card rounded-lg border border-border overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <div className="font-heading text-8xl text-primary/20">EDGAR</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Desde 2011
              </div>
            </div>

            {/* Text Side */}
            <div>
              <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Sobre</p>
              <h2 className="text-4xl md:text-5xl font-heading mb-6">
                Edgar Alexandre<br />
                <span className="text-gradient">Kmiecik</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Sou Edgar Alexandre Kmiecik, de Carazinho/RS. Graduado em Ciências Contábeis pela UPF (2004),
                com Pós-Graduação em Gestão de Pessoas (2009). Técnico em Transações Imobiliárias (2011)
                e Avaliação de Imóveis (2012). Engenheiro Civil pela Ulbra (2019), com Pós-Graduação em
                Engenharia e Segurança do Trabalho (2021) e Estruturas de Concreto Armado (2022). Desde 2011
                trabalho com imóveis — da venda à execução de obras de pequeno e grande porte. Me dedico ao
                conhecimento contínuo para oferecer o melhor serviço, com preço justo e sem complicações para você.
              </p>

              {/* Education Timeline */}
              <div className="mb-8">
                <h3 className="font-heading text-2xl mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Formação
                </h3>
                <div className="space-y-3">
                  {education.map((item) => (
                    <div key={item.year + item.title} className="flex items-center gap-3">
                      <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded shrink-0">
                        {item.year}
                      </span>
                      <span className="text-sm text-muted-foreground">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Softwares */}
              <div className="mb-8">
                <h3 className="font-heading text-2xl mb-4">Softwares</h3>
                <div className="flex flex-wrap gap-2">
                  {softwares.map((sw) => (
                    <span key={sw} className="bg-card border border-border px-3 py-1.5 rounded-md text-sm text-foreground">
                      {sw}
                    </span>
                  ))}
                </div>
              </div>

              <button className="border border-primary text-primary px-6 py-3 rounded-md font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
                Baixar Currículo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
