import { motion } from 'framer-motion';
import { heroImage } from '@/data/site-content';

interface HeroProps {
  title?: string;
  subtitle?: string;
  image?: string;
}

export default function HeroSection({
  title = 'Edgar Alexandre Kmiecik',
  subtitle = 'Engenheiro Civil',
  image,
}: HeroProps) {
  return (
    <section
      id="inicio"
      className="relative min-h-[85vh] md:min-h-screen flex items-end justify-center overflow-hidden"
    >
      <img
        src={image || heroImage}
        alt="Engenheiro analisando planta de loteamento sobre a mesa"
        width={1920}
        height={1280}
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: 'var(--hero-overlay, 0.35)' as unknown as number }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10 pb-16 md:pb-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[38px] sm:text-6xl lg:text-[76px] font-bold text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 inline-block border-t border-b border-white/70 px-6 py-2 text-base md:text-lg font-semibold text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}
