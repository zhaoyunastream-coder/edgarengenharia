import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { sobreImage, sobreTexto, contato } from '@/data/site-content';

export default function AboutSection() {
  return (
    <section id="sobre" className="py-16 md:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <SectionHeading title="Sobre" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.45 }}
          className="max-w-4xl mx-auto text-center"
        >
          <img
            src={sobreImage}
            alt="Edgar Alexandre Kmiecik, Engenheiro Civil"
            width={600}
            height={600}
            loading="lazy"
            className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover mx-auto mb-8 shadow-md"
          />
          <p className="text-[15px] md:text-base text-foreground/80 leading-[1.9] text-justify">
            {sobreTexto}
          </p>
          <p className="mt-6 text-base font-semibold text-foreground">
            Entre em contato, que terei o maior prazer em lhe atender.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {contato.crea} &nbsp;|&nbsp; {contato.creci}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
