import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';
import { marketplace } from '@/data/site-content';
import { useSiteSection } from '@/hooks/use-site-items';

export default function MarketplaceSection({ title = "Marketplace" }: { title?: string }) {
  const { items } = useSiteSection('marketplace', marketplace);

  return (
    <section id="marketplace" className="py-16 md:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <SectionHeading title={title} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
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
                  width={800}
                  height={450}
                  loading="lazy"
                  className="w-full aspect-video object-cover"
                />
              )}
              <div className="p-5 text-left flex flex-col flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/75 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
                {item.link_url ? (
                  <a
                    href={item.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 self-start text-sm uppercase tracking-wide text-primary hover:underline"
                  >
                    {item.cta_label || 'Tenho interesse'}
                  </a>
                ) : (
                  <Link
                    to={`/marketplace/${item.slug}`}
                    className="mt-4 self-start text-sm uppercase tracking-wide text-primary hover:underline"
                  >
                    {item.cta_label || 'Tenho interesse'}
                  </Link>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}