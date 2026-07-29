import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { servicos } from '@/data/site-content';
import { useSiteSection } from '@/hooks/use-site-items';

export default function ServicesSection({ title = "Serviços" }: { title?: string }) {
  const { items } = useSiteSection('servicos', servicos);

  return (
    <section id="servicos" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading title={title} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((service, i) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card-ref overflow-hidden flex flex-col"
            >
              {service.image && (
                <img
                  src={service.image}
                  alt={service.title}
                  width={800}
                  height={450}
                  loading="lazy"
                  className="w-full aspect-video object-cover"
                />
              )}
              <div className="p-6 text-left">
                <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-[15px] text-foreground/80 leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
