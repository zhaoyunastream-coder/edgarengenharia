import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { vocesabia } from '@/data/site-content';
import { useSiteSection } from '@/hooks/use-site-items';

export default function VoceSabiaSection() {
  const { items } = useSiteSection('vocesabia', vocesabia);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="voce-sabia" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading title="Você sabia ???" />

        <div className="max-w-4xl mx-auto space-y-4">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.3 }}
                className="card-ref overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-4 p-4 text-left"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      width={140}
                      height={140}
                      loading="lazy"
                      className="w-14 h-14 rounded-full object-cover shrink-0"
                    />
                  )}
                  <h3 className="flex-1 text-base md:text-lg font-bold text-foreground">{item.title}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-primary shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 pt-0 text-[15px] text-foreground/80 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}