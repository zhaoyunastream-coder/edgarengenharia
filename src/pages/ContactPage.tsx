import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { MapPin, MessageCircle, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { toast } from '@/hooks/use-toast';

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
  'Projetos de Acessibilidade',
  'Perícias e Laudos',
  'Projetos Elétricos',
  'Engenharia Diagnóstica',
];

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);
    const { error } = await supabase.from('contact_submissions').insert([data]);
    setSubmitting(false);

    if (error) {
      toast({ title: 'Erro ao enviar', description: 'Tente novamente mais tarde.', variant: 'destructive' });
    } else {
      toast({ title: 'Mensagem enviada!', description: 'Retornaremos em breve.' });
      reset();
    }
  };

  const inputClasses = "w-full bg-card border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Contato</p>
            <h1 className="text-4xl md:text-6xl font-heading">
              Fale <span className="text-gradient">Conosco</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <input {...register('name')} placeholder="Nome *" className={inputClasses} />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <input {...register('email')} placeholder="E-mail *" className={inputClasses} />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <input {...register('phone')} placeholder="Telefone" className={inputClasses} />
                </div>
                <div>
                  <select {...register('service')} className={inputClasses} defaultValue="">
                    <option value="" disabled>Selecione o serviço</option>
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <textarea {...register('message')} placeholder="Mensagem *" rows={5} className={inputClasses} />
                  {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-heading text-2xl mb-6">Informações de Contato</h3>
                <div className="space-y-5">
                  <a href="https://wa.me/5554999787256" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors"> target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors"> target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">WhatsApp</p>
                      <p className="text-sm">(54) 99999-9999</p>
                    </div>
                  </a>
                  <a href="mailto:contato@eakengenharia.com.br" className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">E-mail</p>
                      <p className="text-sm">contato@eakengenharia.com.br</p>
                    </div>
                  </a>
                  <a <a href="tel:+5554999787256" className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors"> className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Telefone</p>
                      <p className="text-sm">(54) 99999-9999</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-heading text-xl">Localização</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Carazinho, RS — Atendimento presencial e remoto para toda a região.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
      <ChatWidget />
    </div>
  );
}
