import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { MessageCircle, Mail, MapPin, Award, Instagram, Linkedin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { toast } from '@/hooks/use-toast';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(100),
  email: z.string().trim().email('E-mail inválido').max(255),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().trim().min(1, 'Mensagem é obrigatória').max(2000),
  whatsapp_consent: z.boolean().default(true),
});

type ContactForm = z.infer<typeof contactSchema>;

const services = [
  'Projetos e Execução de Obras',
  'Compatibilização BIM',
  'Regularização de Imóveis',
  'INSS de Obras',
  'Desmembramento e Unificação',
  'Cálculos Estruturais',
  'Incorporação de Imóveis',
  'PPCI',
  'Acessibilidade',
  'Perícias e Laudos',
  'Projetos Elétricos',
  'Engenharia Diagnóstica',
  'Outro',
];

const contactInfo = [
  { icon: MessageCircle, label: 'WhatsApp', value: '(54) 99978-7256', href: 'https://wa.me/5554999787256' },
  { icon: Mail, label: 'E-mail', value: 'contato@engenheiroedgar.com.br', href: 'mailto:contato@engenheiroedgar.com.br' },
  { icon: MapPin, label: 'Localização', value: 'Carazinho, RS' },
  { icon: Award, label: 'CREA-RS', value: '243302' },
];

export default function ContactCTASection() {
  const { ref, controls, variants } = useScrollReveal();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { whatsapp_consent: true },
  });

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);
    const { whatsapp_consent, ...submission } = data;
    const { error } = await supabase.from('contact_submissions').insert([{ ...submission }]);
    setSubmitting(false);

    if (error) {
      toast({ title: 'Erro ao enviar', description: 'Tente novamente mais tarde.', variant: 'destructive' });
    } else {
      setSuccess(true);
      toast({ title: 'Mensagem enviada!', description: 'Retornaremos em breve.' });
      reset();
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  const inputClasses =
    'w-full rounded-lg px-4 py-3 text-[15px] transition-all duration-200 ' +
    'bg-[#0A0C0F] border border-[#2D3748] text-[#F1F5F9] placeholder:text-[#4A5568] ' +
    'focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(245,158,11,0.15)]';

  return (
    <section id="contato" className="relative py-24 overflow-hidden" style={{ background: '#0D1117' }}>
      {/* Blueprint grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(135deg, #1E293B 1px, transparent 1px), linear-gradient(225deg, #1E293B 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.08,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={variants}
          className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto"
        >
          {/* LEFT SIDE */}
          <div className="relative pl-8">
            {/* Vertical amber line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-primary/60" />

            <p className="text-primary font-semibold text-xs tracking-[0.25em] uppercase mb-4">
              Fale Comigo
            </p>
            <h2 className="text-4xl md:text-5xl font-heading text-foreground mb-4">
              Vamos conversar sobre{' '}
              <span className="text-gradient">o seu projeto?</span>
            </h2>
            <p className="text-muted-foreground mb-10 max-w-md leading-relaxed">
              Entre em contato e solicite um orçamento sem compromisso. Atendo presencialmente em
              Carazinho/RS e remotamente em todo o Brasil.
            </p>

            {/* Contact info blocks */}
            <div className="space-y-5 mb-10">
              {contactInfo.map(({ icon: Icon, label, value, href }) => {
                const content = (
                  <div className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
                      <p className="text-foreground font-medium">{value}</p>
                    </div>
                  </div>
                );
                return href ? (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                    {content}
                  </a>
                ) : (
                  <div key={label}>{content}</div>
                );
              })}
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: MessageCircle, href: 'https://wa.me/5554999787256' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE — Form Card */}
          <div
            className="rounded-2xl p-10 border border-[#1E293B]"
            style={{
              background: '#161B22',
              boxShadow: '0 0 60px rgba(245,158,11,0.06)',
            }}
          >
            <h3 className="text-2xl font-heading text-foreground mb-8">Solicitar Orçamento</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input {...register('name')} placeholder="Nome completo *" className={inputClasses} />
                {errors.name && <p className="text-destructive text-xs mt-1.5">{errors.name.message}</p>}
              </div>
              <div>
                <input {...register('email')} type="email" placeholder="E-mail *" className={inputClasses} />
                {errors.email && <p className="text-destructive text-xs mt-1.5">{errors.email.message}</p>}
              </div>
              <div>
                <input {...register('phone')} placeholder="Telefone / WhatsApp" className={inputClasses} />
              </div>
              <div>
                <select {...register('service')} defaultValue="" className={inputClasses}>
                  <option value="" disabled>Selecione um serviço...</option>
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <textarea
                  {...register('message')}
                  placeholder="Como posso te ajudar? *"
                  rows={4}
                  className={inputClasses}
                />
                {errors.message && <p className="text-destructive text-xs mt-1.5">{errors.message.message}</p>}
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('whatsapp_consent')}
                  className="w-4 h-4 rounded border-[#2D3748] bg-[#0A0C0F] text-primary accent-primary"
                />
                <span className="text-sm text-muted-foreground">Aceito receber contato via WhatsApp</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-[52px] rounded-lg bg-primary text-primary-foreground font-bold text-base flex items-center justify-center gap-2 hover:brightness-110 hover:scale-[1.01] transition-all disabled:opacity-60 disabled:pointer-events-none mt-2"
              >
                {success ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-900" />
                    Mensagem enviada! Entrarei em contato em breve.
                  </>
                ) : submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar Mensagem <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
