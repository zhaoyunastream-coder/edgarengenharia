import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { cursos, contato } from '@/data/site-content';

const STEP = 12;

export default function CursosSection() {
  const [visible, setVisible] = useState(STEP);
  const shown = cursos.slice(0, visible);

  return (
    <section id="cursos" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading title="Cursos" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((item, i) => (
            <motion.article
              key={item.title + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.35 }}
              className="card-ref overflow-hidden flex flex-col"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={338}
                  loading="lazy"
                  className="w-full aspect-video object-cover"
                />
              )}
              <div className="p-5 text-left flex flex-col flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/75 leading-relaxed whitespace-pre-line line-clamp-6">
                  {item.desc}
                </p>
                <a
                  href={`${contato.whatsappHref}?text=${encodeURIComponent(
                    `Olá Edgar, tenho interesse no curso: ${item.title}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 self-start text-sm uppercase tracking-wide text-primary hover:underline"
                >
                  Saiba Mais
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {visible < cursos.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisible((v) => v + STEP)}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-[3px] text-sm uppercase tracking-wide hover:brightness-95 transition-all"
            >
              Mostrar mais cursos
            </button>
          </div>
        )}
      </div>
    </section>
  );
}