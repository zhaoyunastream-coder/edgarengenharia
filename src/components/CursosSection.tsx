import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';
import { cursos } from '@/data/site-content';
import { useSiteSection } from '@/hooks/use-site-items';

const STEP = 12;

export default function CursosSection({ title = "Cursos" }: { title?: string }) {
  const { items } = useSiteSection('cursos', cursos);
  const [visible, setVisible] = useState(STEP);
  const shown = items.slice(0, visible);

  return (
    <section id="cursos" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading title={title} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((item, i) => (
            <motion.article
              key={item.id}
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
                  {item.description}
                </p>
                {item.link_url ? (
                  <a
                    href={item.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 self-start text-sm uppercase tracking-wide text-primary hover:underline"
                  >
                    {item.cta_label || 'Saiba Mais'}
                  </a>
                ) : (
                  <Link
                    to={`/cursos/${item.slug}`}
                    className="mt-4 self-start text-sm uppercase tracking-wide text-primary hover:underline"
                  >
                    {item.cta_label || 'Saiba Mais'}
                  </Link>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {visible < items.length && (
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