import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { MessageCircle, Mail, MapPin, Clock, Phone, Send, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import SectionHeading from './SectionHeading';
import { contato } from '@/data/site-content';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(100),
  email: z.string().trim().email('E-mail inválido').max(255),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().trim().min(1, 'Mensagem é obrigatória').max(2000),
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
  'Imóveis',
  'Cursos',
  'Marketplace',
  'Outro',
];

const info = [
  { icon: MapPin, label: 'Endereço', value: contato.endereco, href: contato.mapa },
  { icon: MessageCircle, label: 'WhatsApp', value: contato.whatsapp, href: contato.whatsappHref },
  { icon: Phone, label: 'Telefone', value: contato.telefone, href: contato.telefoneHref },
  { icon: Mail, label: 'E-mail', value: contato.email, href: `mailto:${contato.email}` },
  { icon: Clock, label: 'Horário', value: contato.horario },
];

export default function ContactCTASection() {
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);
    const { error } = await supabase.from('contact_submissions').insert([{ ...data }]);

    if (error) {
      setSubmitting(false);
      toast({ title: 'Erro ao enviar', description: 'Tente novamente mais tarde.', variant: 'destructive' });
      return;
    }

    supabase.functions.invoke('send-contact-email', { body: data }).catch(console.error);

    setSubmitting(false);
    if (window.gtag) window.gtag('event', 'conversion_formulario', { event_category: 'contato', event_label: 'formulario_orcamento' });
    toast({ title: 'Mensagem enviada!', description: 'Retornaremos em breve.' });
    reset();
  };

  const inputClasses =
    'w-full rounded-[3px] px-4 py-3 text-[15px] bg-background border border-border text-foreground ' +
    'placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors';

  return (
    <section id="contato" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading title="Contato" />

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Info */}
          <ul className="space-y-6">
            {info.map(({ icon: Icon, label, value, href }) => {
              const body = (
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
                    <span className="block text-[15px] text-foreground">{value}</span>
                  </span>
                </div>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                      {body}
                    </a>
                  ) : body}
                </li>
              );
            })}
          </ul>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input {...register('name')} placeholder="Nome *" className={inputClasses} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <input {...register('email')} placeholder="E-mail *" className={inputClasses} />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <input {...register('phone')} placeholder="Telefone / WhatsApp" className={inputClasses} />
            <select {...register('service')} defaultValue="" className={inputClasses}>
              <option value="" disabled>Assunto</option>
              {services.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <div>
              <textarea {...register('message')} rows={5} placeholder="Mensagem *" className={inputClasses} />
              {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-[3px] text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:brightness-95 transition-all disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Enviar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}