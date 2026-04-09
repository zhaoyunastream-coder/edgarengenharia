import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Send, Loader2, ArrowLeft, Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageCropModal from '@/components/admin/ImageCropModal';

const DEFAULT_CATEGORIES = [
  'BIM e Tecnologia',
  'Regularização de Imóveis',
  'INSS de Obras',
  'Prevenção contra Incêndio',
  'Engenharia Civil',
  'Cálculos Estruturais',
  'Incorporação de Imóveis',
  'Outro',
];

const CUSTOM_CATEGORIES_KEY = 'edgar_blog_categories';

function getCustomCategories(): string[] {
  try {
    const stored = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveCustomCategories(cats: string[]) {
  localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(cats));
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [customCategories, setCustomCategories] = useState<string[]>(getCustomCategories());
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);

  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];

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
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
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

  // --- Category helpers ---
  const handleAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    if (allCategories.includes(name)) {
      toast({ title: 'Categoria já existe', variant: 'destructive' });
      return;
    }
    const updated = [...customCategories, name];
    setCustomCategories(updated);
    saveCustomCategories(updated);
    update('category', name);
    setNewCategoryName('');
    setShowNewCategory(false);
  };

  const handleRemoveCategory = (cat: string) => {
    const updated = customCategories.filter((c) => c !== cat);
    setCustomCategories(updated);
    saveCustomCategories(updated);
    if (form.category === cat) update('category', '');
  };

  // --- Image upload helpers ---
  const handleFileSelected = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Apenas imagens são permitidas', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Imagem deve ter no máximo 5MB', variant: 'destructive' });
      return;
    }
    setCropFile(file);
  };

  const handleCropConfirm = async (blob: Blob) => {
    setCropFile(null);
    setUploading(true);
    const path = `blog-covers/${Date.now()}.webp`;

    const { error } = await supabase.storage.from('blog-images').upload(path, blob, {
      cacheControl: '3600',
      upsert: false,
      contentType: 'image/webp',
    });

    if (error) {
      toast({ title: 'Erro no upload', description: error.message, variant: 'destructive' });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(path);
    update('cover_image', urlData.publicUrl);
    setUploading(false);
    toast({ title: 'Imagem enviada com sucesso!' });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelected(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
    e.target.value = '';
  };

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
          <div className="flex gap-2">
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className="flex-1 bg-card border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors">
              <option value="">Selecione...</option>
              {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {!showNewCategory ? (
              <button
                type="button"
                onClick={() => setShowNewCategory(true)}
                className="flex items-center gap-1 px-3 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Nova
              </button>
            ) : (
              <div className="flex gap-1">
                <input
                  autoFocus
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors w-40"
                  placeholder="Nome da categoria"
                />
                <button type="button" onClick={handleAddCategory} className="px-2 py-1 text-primary hover:text-primary/80 text-sm font-semibold">OK</button>
                <button type="button" onClick={() => { setShowNewCategory(false); setNewCategoryName(''); }} className="px-2 py-1 text-muted-foreground hover:text-foreground text-sm">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          {/* Custom category chips */}
          {customCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {customCategories.map((cat) => (
                <span key={cat} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                  {cat}
                  <button type="button" onClick={() => handleRemoveCategory(cat)} className="hover:text-destructive transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cover Image Dropzone */}
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">Imagem de Capa</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          {!form.cover_image ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
                dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              {uploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm text-foreground">Clique ou arraste uma imagem</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou WebP • Máximo 5MB</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="relative group rounded-lg overflow-hidden border border-border">
              <img src={form.cover_image} alt="Capa" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:brightness-110 transition-all"
                >
                  Trocar
                </button>
                <button
                  type="button"
                  onClick={() => update('cover_image', '')}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-semibold hover:brightness-110 transition-all"
                >
                  Remover
                </button>
              </div>
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

      {/* Crop Modal */}
      {cropFile && (
        <ImageCropModal
          file={cropFile}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropFile(null)}
        />
      )}
    </div>
  );
}
