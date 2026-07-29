import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import ImageCropModal from '@/components/admin/ImageCropModal';
import { normalizeItem, slugify, type SiteItem, type SiteSection } from '@/hooks/use-site-items';
import {
  cursos,
  imoveis,
  linksUteis,
  marketplace,
  servicos,
  vocesabia,
} from '@/data/site-content';

const SECTIONS: { key: SiteSection; label: string; hasSlug: boolean; hasPage: boolean }[] = [
  { key: 'servicos', label: 'Serviços', hasSlug: false, hasPage: false },
  { key: 'imoveis', label: 'Imóveis', hasSlug: true, hasPage: true },
  { key: 'cursos', label: 'Cursos', hasSlug: true, hasPage: true },
  { key: 'marketplace', label: 'Marketplace', hasSlug: true, hasPage: true },
  { key: 'vocesabia', label: 'Você sabia', hasSlug: false, hasPage: false },
  { key: 'links', label: 'Links Úteis', hasSlug: false, hasPage: false },
];

const MAX_SIZE = 5 * 1024 * 1024;

type Draft = Partial<SiteItem> & { section: SiteSection };

const STATIC_DATA: Record<SiteSection, { title: string; desc?: string; image?: string; url?: string }[]> = {
  servicos,
  imoveis,
  cursos,
  marketplace,
  vocesabia,
  links: linksUteis.map((l) => ({ title: l.label, url: l.href })),
};

function buildRows(sectionKey: SiteSection) {
  const hasSlug = SECTIONS.find((s) => s.key === sectionKey)!.hasSlug;
  const seen = new Set<string>();
  return STATIC_DATA[sectionKey].map((it, i) => {
    let slug: string | null = hasSlug ? slugify(it.title) : null;
    if (slug) {
      const base = slug;
      let n = 2;
      while (seen.has(slug)) slug = `${base}-${n++}`;
      seen.add(slug);
    }
    return {
      section: sectionKey,
      title: it.title,
      slug,
      description: it.desc ?? null,
      image: it.image ?? null,
      link_url: it.url ?? null,
      sort_order: i,
    };
  });
}

async function uploadBlob(blob: Blob, folder: string) {
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const { error } = await supabase.storage.from('blog-images').upload(path, blob, {
    contentType: 'image/webp',
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from('blog-images').getPublicUrl(path).data.publicUrl;
}

export default function AdminSiteEditor() {
  const qc = useQueryClient();
  const [section, setSection] = useState<SiteSection>('imoveis');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropTarget, setCropTarget] = useState<'cover' | 'gallery'>('cover');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const cfg = SECTIONS.find((s) => s.key === section)!;

  const { data: counts = {} as Record<string, number>, isLoading: countsLoading } = useQuery({
    queryKey: ['admin-site-counts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_items').select('section');
      if (error) throw error;
      const map: Record<string, number> = {};
      (data ?? []).forEach((r) => {
        map[r.section as string] = (map[r.section as string] ?? 0) + 1;
      });
      return map;
    },
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-site-items', section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_items')
        .select('*')
        .eq('section', section)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []).map((r) => normalizeItem(r as Record<string, unknown>));
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-site-items', section] });
    qc.invalidateQueries({ queryKey: ['site-items', section] });
    qc.invalidateQueries({ queryKey: ['admin-site-counts'] });
  };

  const saveMutation = useMutation({
    mutationFn: async (d: Draft) => {
      const payload = {
        section: d.section,
        title: (d.title ?? '').trim(),
        slug: cfg.hasSlug ? (d.slug?.trim() || slugify(d.title ?? '')) : null,
        description: d.description ?? null,
        image: d.image ?? null,
        gallery: d.gallery ?? [],
        link_url: d.link_url?.trim() || null,
        cta_label: d.cta_label?.trim() || null,
        published: d.published ?? true,
        sort_order: d.sort_order ?? items.length,
      };
      if (!payload.title) throw new Error('Informe um título.');
      if (d.id) {
        const { error } = await supabase.from('site_items').update(payload).eq('id', d.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_items').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: 'Salvo com sucesso' });
      setDraft(null);
      invalidate();
    },
    onError: (e: Error) => toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('site_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Item excluído' });
      invalidate();
    },
    onError: (e: Error) => toast({ title: 'Erro ao excluir', description: e.message, variant: 'destructive' }),
  });

  const patchMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { error } = await supabase.from('site_items').update(values).eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const importMutation = useMutation({
    mutationFn: async (targets: SiteSection[]) => {
      let total = 0;
      for (const key of targets) {
        const rows = buildRows(key);
        if (!rows.length) continue;
        const { error } = await supabase.from('site_items').insert(rows);
        if (error) throw error;
        total += rows.length;
      }
      return total;
    },
    onSuccess: (n) => {
      if (n > 0) toast({ title: `${n} itens importados para o editor` });
      SECTIONS.forEach((s) => {
        qc.invalidateQueries({ queryKey: ['admin-site-items', s.key] });
        qc.invalidateQueries({ queryKey: ['site-items', s.key] });
      });
      qc.invalidateQueries({ queryKey: ['admin-site-counts'] });
    },
    onError: (e: Error) => toast({ title: 'Erro ao importar', description: e.message, variant: 'destructive' }),
  });

  // Sincroniza automaticamente as seções que ainda não têm conteúdo no banco,
  // para o editor já abrir com todo o conteúdo atual do site.
  const autoSynced = useRef(false);
  useEffect(() => {
    if (countsLoading || autoSynced.current || importMutation.isPending) return;
    const missing = SECTIONS.filter((s) => !counts[s.key]).map((s) => s.key);
    if (missing.length === 0) {
      autoSynced.current = true;
      return;
    }
    autoSynced.current = true;
    importMutation.mutate(missing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countsLoading, counts]);

  const move = (index: number, dir: -1 | 1) => {
    const target = items[index + dir];
    const current = items[index];
    if (!target || !current) return;
    patchMutation.mutate({ id: current.id, values: { sort_order: target.sort_order } });
    patchMutation.mutate({ id: target.id, values: { sort_order: current.sort_order } });
  };

  const pickFile = (target: 'cover' | 'gallery') => {
    setCropTarget(target);
    fileRef.current?.click();
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Arquivo inválido', description: 'Selecione uma imagem.', variant: 'destructive' });
      return;
    }
    if (file.size > MAX_SIZE) {
      toast({ title: 'Imagem muito grande', description: 'Máximo de 5MB.', variant: 'destructive' });
      return;
    }
    setCropFile(file);
  };

  const onCropConfirm = async (blob: Blob) => {
    setCropFile(null);
    setUploading(true);
    try {
      const url = await uploadBlob(blob, 'site');
      setDraft((d) =>
        d
          ? cropTarget === 'cover'
            ? { ...d, image: url }
            : { ...d, gallery: [...(d.gallery ?? []), url] }
          : d,
      );
    } catch (err) {
      toast({ title: 'Erro no upload', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const emptyDraft = useMemo<Draft>(
    () => ({ section, title: '', description: '', gallery: [], published: true, sort_order: items.length }),
    [section, items.length],
  );

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl">Editor do Site</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie o conteúdo das seções da página inicial.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-border px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
          >
            <ExternalLink className="w-4 h-4" /> Ver site
          </a>
          <button
            onClick={() => importMutation.mutate([section])}
            disabled={importMutation.isPending}
            className="inline-flex items-center gap-2 border border-border px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted disabled:opacity-60"
            title="Recarrega o conteúdo padrão desta seção (adiciona aos itens existentes)"
          >
            {importMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Importar padrão
          </button>
          <button
            onClick={() => setDraft(emptyDraft)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:brightness-95"
          >
            <Plus className="w-4 h-4" /> Novo item
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              section === s.key
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {s.label}
            {counts[s.key] ? (
              <span className="ml-2 text-xs opacity-70">{counts[s.key]}</span>
            ) : null}
          </button>
        ))}
      </div>

      {isLoading || importMutation.isPending ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Nenhum item cadastrado nesta seção. O site está exibindo o conteúdo padrão.
          </p>
          <button
            onClick={() => importMutation.mutate([section])}
            disabled={importMutation.isPending}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
          >
            {importMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Importar conteúdo atual do site
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
            >
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-20 h-12 object-cover rounded shrink-0" />
              ) : (
                <div className="w-20 h-12 rounded bg-muted shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.link_url
                    ? item.link_url
                    : cfg.hasPage
                      ? `/${section}/${item.slug}`
                      : item.description?.slice(0, 80)}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {cfg.hasPage && item.slug && (
                  <a
                    href={`/${section}/${item.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                    aria-label="Ver página"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="p-2 rounded-lg hover:bg-muted disabled:opacity-30"
                  aria-label="Subir"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  className="p-2 rounded-lg hover:bg-muted disabled:opacity-30"
                  aria-label="Descer"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => patchMutation.mutate({ id: item.id, values: { published: !item.published } })}
                  className="p-2 rounded-lg hover:bg-muted"
                  aria-label={item.published ? 'Ocultar' : 'Publicar'}
                >
                  {item.published ? (
                    <Eye className="w-4 h-4 text-primary" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => setDraft({ ...item, section })}
                  className="px-3 py-2 rounded-lg text-sm hover:bg-muted"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Excluir "${item.title}"?`)) deleteMutation.mutate(item.id);
                  }}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"
                  aria-label="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" onChange={onFileSelected} className="hidden" />

      {draft && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-heading text-xl">{draft.id ? 'Editar item' : 'Novo item'}</h2>
              <button onClick={() => setDraft(null)} className="p-2 rounded-lg hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Título</label>
                <input
                  value={draft.title ?? ''}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
                />
              </div>

              {cfg.hasSlug && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Endereço da página (slug)
                  </label>
                  <input
                    value={draft.slug ?? ''}
                    onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })}
                    placeholder={slugify(draft.title ?? '')}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    /{section}/{draft.slug || slugify(draft.title ?? '') || 'exemplo'}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5">Descrição</label>
                <textarea
                  value={draft.description ?? ''}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  rows={6}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Link externo {cfg.hasPage && '(opcional — se preenchido, o botão abre este link em vez da página interna)'}
                </label>
                <input
                  value={draft.link_url ?? ''}
                  onChange={(e) => setDraft({ ...draft, link_url: e.target.value })}
                  placeholder="https://…"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Texto do botão</label>
                <input
                  value={draft.cta_label ?? ''}
                  onChange={(e) => setDraft({ ...draft, cta_label: e.target.value })}
                  placeholder="Saiba Mais"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Imagem principal</label>
                {draft.image ? (
                  <div className="relative group">
                    <img src={draft.image} alt="" className="w-full aspect-video object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-lg">
                      <button
                        onClick={() => pickFile('cover')}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm"
                      >
                        Trocar
                      </button>
                      <button
                        onClick={() => setDraft({ ...draft, image: null })}
                        className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => pickFile('cover')}
                    disabled={uploading}
                    className="w-full aspect-video border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <ImagePlus className="w-6 h-6" />
                        <span className="text-sm">Clique para enviar (máx. 5MB)</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {cfg.hasPage && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Galeria (página de detalhe)</label>
                  <div className="flex flex-wrap gap-2">
                    {(draft.gallery ?? []).map((img) => (
                      <div key={img} className="relative">
                        <img src={img} alt="" className="w-28 aspect-video object-cover rounded" />
                        <button
                          onClick={() =>
                            setDraft({ ...draft, gallery: (draft.gallery ?? []).filter((g) => g !== img) })
                          }
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                          aria-label="Remover imagem"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => pickFile('gallery')}
                      className="w-28 aspect-video border-2 border-dashed border-border rounded flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.published ?? true}
                  onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                />
                Publicado no site
              </label>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-border">
              <button onClick={() => setDraft(null)} className="px-4 py-2.5 rounded-lg text-sm hover:bg-muted">
                Cancelar
              </button>
              <button
                onClick={() => saveMutation.mutate(draft)}
                disabled={saveMutation.isPending}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {cropFile && (
        <ImageCropModal file={cropFile} onConfirm={onCropConfirm} onCancel={() => setCropFile(null)} />
      )}
    </div>
  );
}