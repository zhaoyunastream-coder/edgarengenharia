import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Send, Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

const categories = [
  'BIM e Tecnologia',
  'Regularização de Imóveis',
  'INSS de Obras',
  'Prevenção contra Incêndio',
  'Engenharia Civil',
  'Cálculos Estruturais',
  'Incorporação de Imóveis',
  'Outro',
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminPostEditor() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: '',
    cover_image: '',
    excerpt: '',
    content: '',
    published: false,
    meta_title: '',
    meta_description: '',
  });
  const [autoSlug, setAutoSlug] = useState(true);
  const [saving, setSaving] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ['admin-post', id],
    enabled: isEdit,
    queryFn: async () => {
      const { data } = await supabase.from('blog_posts').select('*').eq('id', id!).single();
      if (data) {
        setForm({
          title: data.title,
          slug: data.slug,
          category: data.category || '',
          cover_image: data.cover_image || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          published: !!data.published,
          meta_title: (data as any).meta_title || '',
          meta_description: (data as any).meta_description || '',
        });
        setAutoSlug(false);
      }
      return data;
    },
  });

  useEffect(() => {
    if (autoSlug && form.title) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, autoSlug]);

  const update = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async (publish: boolean) => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast({ title: 'Preencha título e slug', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      category: form.category || null,
      cover_image: form.cover_image || null,
      excerpt: form.excerpt || null,
      content: form.content || null,
      published: publish,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      updated_at: new Date().toISOString(),
    };

    if (publish) payload.published_at = new Date().toISOString();

    let error;
    if (isEdit) {
      ({ error } = await supabase.from('blog_posts').update(payload).eq('id', id!));
    } else {
      ({ error } = await supabase.from('blog_posts').insert(payload as any));
    }

    setSaving(false);
    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: publish ? 'Post publicado!' : 'Rascunho salvo!' });
      navigate('/admin/posts');
    }
  };

  if (isEdit && isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/posts')} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-heading text-3xl">{isEdit ? 'Editar Post' : 'Novo Post'}</h1>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">Título *</label>
          <input value={form.title} onChange={(e) => update('title', e.target.value)} className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="Título do post" />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">Slug *</label>
          <input
            value={form.slug}
            onChange={(e) => { setAutoSlug(false); update('slug', e.target.value); }}
            className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors font-mono text-sm"
            placeholder="titulo-do-post"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">Categoria</label>
          <select value={form.category} onChange={(e) => update('category', e.target.value)} className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors">
            <option value="">Selecione...</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">Imagem de Capa (URL)</label>
          <input value={form.cover_image} onChange={(e) => update('cover_image', e.target.value)} className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="https://..." />
          {form.cover_image && (
            <div className="mt-2 rounded-lg overflow-hidden border border-border">
              <img src={form.cover_image} alt="Preview" className="w-full h-48 object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">Resumo <span className="text-xs">({form.excerpt.length}/200)</span></label>
          <textarea
            value={form.excerpt}
            onChange={(e) => { if (e.target.value.length <= 200) update('excerpt', e.target.value); }}
            rows={3}
            className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
            placeholder="Breve resumo do post..."
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">Conteúdo</label>
          <RichTextEditor content={form.content} onChange={(html) => update('content', html)} />
        </div>

        {/* SEO */}
        <div className="border-t border-border pt-4 space-y-4">
          <h3 className="font-heading text-lg">SEO</h3>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Meta Title</label>
            <input value={form.meta_title} onChange={(e) => update('meta_title', e.target.value)} className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="Título para SEO" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Meta Description</label>
            <textarea value={form.meta_description} onChange={(e) => update('meta_description', e.target.value)} rows={2} className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Descrição para SEO" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button onClick={() => handleSave(false)} disabled={saving} className="flex-1 border border-border text-foreground px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-all disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar Rascunho
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} className="flex-1 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}
