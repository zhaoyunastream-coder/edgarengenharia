import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { imoveis, contato } from '@/data/site-content';

export default function ImoveisSection() {
  return (
    <section id="imoveis" className="py-16 md:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <SectionHeading title="Imóveis" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {imoveis.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: Math.min(i, 5) * 0.05 }}
              className="flex flex-col items-center text-center"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  width={200}
                  height={200}
                  loading="lazy"
                  className="w-[100px] h-[100px] rounded-full object-cover border-4 border-background shadow-md mb-5"
                />
              )}
              <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-[15px] text-foreground/80 leading-relaxed whitespace-pre-line mb-5">
                {item.desc}
              </p>
              <a
                href={`${contato.whatsappHref}?text=${encodeURIComponent(
                  `Olá Edgar, gostaria de saber mais sobre o imóvel: ${item.title}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-block bg-primary text-primary-foreground px-6 py-3 rounded-[3px] text-sm uppercase tracking-wide hover:brightness-95 transition-all"
              >
                Saiba Mais
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}