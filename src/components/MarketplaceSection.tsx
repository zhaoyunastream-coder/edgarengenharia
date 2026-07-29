import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { marketplace, contato } from '@/data/site-content';

export default function MarketplaceSection() {
  return (
    <section id="marketplace" className="py-16 md:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <SectionHeading title="Marketplace" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketplace.map((item, i) => (
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
                  width={800}
                  height={450}
                  loading="lazy"
                  className="w-full aspect-video object-cover"
                />
              )}
              <div className="p-5 text-left flex flex-col flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/75 leading-relaxed whitespace-pre-line">
                  {item.desc}
                </p>
                <a
                  href={`${contato.whatsappHref}?text=${encodeURIComponent(
                    `Olá Edgar, tenho interesse no anúncio: ${item.title}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 self-start text-sm uppercase tracking-wide text-primary hover:underline"
                >
                  Tenho interesse
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}