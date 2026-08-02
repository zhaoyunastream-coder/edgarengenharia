import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Eye,
  EyeOff,
  GripVertical,
  HelpCircle,
  ImageIcon,
  Loader2,
  MessageSquare,
  Monitor,
  Palette,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Share2,
  Smartphone,
  Trash2,
  User,
  Upload,
  Type as TypeIcon,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ImageCropModal from '@/components/admin/ImageCropModal';
import { heroImage as defaultHeroImage } from '@/data/site-content';
import {
  DEFAULT_CONFIG,
  FONT_OPTIONS,
  SECTION_DEFS,
  fetchSiteConfig,
  saveSiteConfig,
  type SiteContact,
  type SocialIcon,
  type SiteConfig,
  type SectionId,
} from '@/hooks/use-site-config';

const labelOf = (id: SectionId) => SECTION_DEFS.find((s) => s.id === id)?.label ?? id;

const COLOR_FIELDS: { key: 'primary' | 'background' | 'foreground' | 'muted'; label: string }[] = [
  { key: 'primary', label: 'Cor principal (destaque)' },
  { key: 'background', label: 'Fundo do site' },
  { key: 'foreground', label: 'Cor do texto' },
  { key: 'muted', label: 'Fundo alternado das seções' },
];

const PALETTES = [
  { label: 'Turquesa (atual)', primary: '#2CCFD8', background: '#FFFFFF', foreground: '#252525', muted: '#F6F6F6' },
  { label: 'Azul engenharia', primary: '#1E6FD9', background: '#FFFFFF', foreground: '#1B2430', muted: '#F1F5FB' },
  { label: 'Verde obra', primary: '#0F9D58', background: '#FFFFFF', foreground: '#1F2A24', muted: '#F2F8F4' },
  { label: 'Grafite & âmbar', primary: '#E8A33D', background: '#FFFFFF', foreground: '#22252A', muted: '#F5F5F4' },
];

const DESKTOP_PREVIEW_WIDTH = 1440;

const CONTACT_FIELDS: { key: keyof SiteContact; label: string; placeholder?: string }[] = [
  { key: 'endereco', label: 'Endereço' },
  { key: 'mapa', label: 'Link do Google Maps (opcional)', placeholder: 'Deixe vazio para gerar pelo endereço' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: '+55-54999999999' },
  { key: 'telefone', label: 'Telefone', placeholder: '+55-54999999999' },
  { key: 'email', label: 'E-mail' },
  { key: 'horario', label: 'Horário de atendimento' },
  { key: 'crea', label: 'CREA' },
  { key: 'creci', label: 'CRECI' },
];

const SOCIAL_ICON_OPTIONS: SocialIcon[] = ['facebook', 'instagram', 'whatsapp', 'email', 'linkedin', 'youtube', 'site'];

const inputCls = 'w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm';

const TUTORIAL_STEPS: { title: string; body: string }[] = [
  {
    title: '1. O que é esta tela',
    body:
      'Aqui do lado direito você vê o site exatamente como o visitante vê. Tudo que você mudar no painel da esquerda aparece na hora na pré-visualização — mas ainda NÃO está no ar.',
  },
  {
    title: '2. Publicar as mudanças',
    body:
      'Depois de mexer em qualquer coisa, clique no botão azul "Publicar alterações" no topo do painel. Enquanto ele estiver escrito "Tudo salvo", nada está pendente. O botão da setinha ao lado desfaz o que você mudou e ainda não publicou.',
  },
  {
    title: '3. Mostrar / esconder seções',
    body:
      'No bloco "Seções da página", cada linha é uma faixa do site (Início, Serviços, Imóveis...). Clique no olho para esconder — a seção some da home E também do menu do topo e do rodapé. Clique de novo para mostrar.',
  },
  {
    title: '4. Mudar a ordem das seções',
    body:
      'Segure o ícone de pontinhos (⠿) à esquerda do nome e arraste a linha para cima ou para baixo. O número da direita mostra a posição final na página.',
  },
  {
    title: '5. Trocar títulos',
    body:
      'No bloco "Títulos das seções" você troca o nome que aparece em cada faixa do site (e no menu). Na capa você também pode escrever o subtítulo, aquela frase menor embaixo do nome.',
  },
  {
    title: '6. Trocar a foto de capa',
    body:
      'Passe o mouse em cima da foto no bloco "Foto da capa", clique em "Trocar foto" e escolha a imagem no seu computador. Depois arraste/dê zoom para escolher o enquadramento e confirme. "Restaurar padrão" volta a foto original.',
  },
  {
    title: '7. Cores, fonte e cantos',
    body:
      'Escolha uma paleta pronta ou clique no quadradinho colorido para escolher a cor manualmente. A "Cor principal" é o destaque (botões e links). Os controles deslizantes mudam o arredondamento dos cantos e o quanto a foto da capa fica escura por trás do texto.',
  },
  {
    title: '8. Ver no celular',
    body:
      'Nos ícones acima da pré-visualização, escolha o monitor (computador) ou o celular para conferir como fica em cada tela. No modo computador o menu aparece escrito; no celular ele vira o botão de três risquinhos.',
  },
  {
    title: '9. E o conteúdo (imóveis, serviços, blog)?',
    body:
      'Fotos, textos e itens de cada seção ficam na aba "Conteúdo das seções", no topo desta página. Lá você adiciona, edita e apaga imóveis, serviços, produtos e links.',
  },
];

async function uploadBlob(blob: Blob, prefix = 'hero') {
  const path = `site/${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const { error } = await supabase.storage.from('blog-images').upload(path, blob, {
    contentType: 'image/webp',
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from('blog-images').getPublicUrl(path).data.publicUrl;
}

export default function SiteAppearanceEditor() {
  const qc = useQueryClient();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const aboutFileRef = useRef<HTMLInputElement>(null);
  const logoFileRef = useRef<HTMLInputElement>(null);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showTutorial, setShowTutorial] = useState(false);
  const previewBoxRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(0);
  const [draft, setDraft] = useState<SiteConfig | null>(null);
  const [ready, setReady] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropTarget, setCropTarget] = useState<'hero' | 'about'>('hero');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const el = previewBoxRef.current;
    if (!el) return;
    const update = () => setBoxWidth(el.clientWidth);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [draft, device]);

  const { data, isLoading } = useQuery({ queryKey: ['site-config'], queryFn: fetchSiteConfig });

  useEffect(() => {
    if (data && !draft) setDraft(data);
  }, [data, draft]);

  // handshake com o preview
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === 'edgar-site-preview-ready') setReady(true);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // envia alterações ao vivo para o preview
  useEffect(() => {
    if (!draft || !ready) return;
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'edgar-site-preview', config: draft },
      window.location.origin,
    );
  }, [draft, ready]);

  const save = useMutation({
    mutationFn: async () => {
      if (!draft) return;
      await saveSiteConfig(draft);
    },
    onSuccess: () => {
      toast({ title: 'Site atualizado', description: 'As mudanças já estão no ar.' });
      qc.invalidateQueries({ queryKey: ['site-config'] });
    },
    onError: (e: Error) => toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' }),
  });

  const patch = (fn: (c: SiteConfig) => SiteConfig) => setDraft((c) => (c ? fn(c) : c));

  const onPickFile = (file: File | null | undefined, target: 'hero' | 'about' = 'hero') => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Arquivo inválido', description: 'Selecione uma imagem.', variant: 'destructive' });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: 'Imagem muito grande', description: 'Máximo de 8MB.', variant: 'destructive' });
      return;
    }
    setCropTarget(target);
    setCropFile(file);
  };

  const onPickLogo = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Arquivo inválido', description: 'Selecione uma imagem.', variant: 'destructive' });
      return;
    }
    setUploading(true);
    try {
      const path = `site/logo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name.replace(/[^\w.-]/g, '')}`;
      const { error } = await supabase.storage.from('blog-images').upload(path, file, { contentType: file.type });
      if (error) throw error;
      const url = supabase.storage.from('blog-images').getPublicUrl(path).data.publicUrl;
      patch((c) => ({ ...c, brand: { ...c.brand, logo: url } }));
      toast({ title: 'Logo atualizada', description: 'Clique em "Publicar alterações".' });
    } catch (e) {
      toast({ title: 'Erro no upload', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const onCropConfirm = async (blob: Blob) => {
    const target = cropTarget;
    setCropFile(null);
    setUploading(true);
    try {
      const url = await uploadBlob(blob, target);
      if (target === 'about') patch((c) => ({ ...c, about: { ...c.about, image: url } }));
      else patch((c) => ({ ...c, theme: { ...c.theme, heroImage: url } }));
      toast({ title: 'Foto atualizada', description: 'Clique em "Publicar alterações" para ir ao ar.' });
    } catch (e) {
      toast({ title: 'Erro no upload', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const moveTo = (from: number, to: number) =>
    patch((c) => {
      const layout = [...c.layout];
      const [item] = layout.splice(from, 1);
      layout.splice(to, 0, item);
      return { ...c, layout };
    });

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(data), [draft, data]);

  if (isLoading || !draft) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
      {/* Painel de edição */}
      <div className="space-y-6">
        {/* Tutorial */}
        <div className="bg-primary/5 border border-primary/30 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowTutorial((v) => !v)}
            className="w-full flex items-center gap-2 px-4 py-3 text-left"
          >
            <HelpCircle className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm font-medium flex-1">Como usar o editor (passo a passo)</span>
            <span className="text-xs text-muted-foreground">{showTutorial ? 'fechar' : 'abrir'}</span>
          </button>
          {showTutorial && (
            <ol className="px-4 pb-4 space-y-3">
              {TUTORIAL_STEPS.map((s) => (
                <li key={s.title} className="bg-background border border-border rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">{s.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.body}</p>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-2">
          <button
            onClick={() => save.mutate()}
            disabled={!dirty || save.isPending}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {dirty ? 'Publicar alterações' : 'Tudo salvo'}
          </button>
          <button
            onClick={() => setDraft(data ?? DEFAULT_CONFIG)}
            className="p-2.5 rounded-lg border border-border hover:bg-muted"
            title="Desfazer alterações não salvas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Ordem das seções */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading text-lg mb-1">Seções da página</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Arraste para reordenar e use o olho para mostrar ou esconder.
          </p>
          <div className="space-y-2">
            {draft.layout.map((s, i) => (
              <div
                key={s.id}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragIndex !== null && dragIndex !== i) {
                    moveTo(dragIndex, i);
                    setDragIndex(i);
                  }
                }}
                onDragEnd={() => setDragIndex(null)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 bg-background cursor-grab active:cursor-grabbing ${
                  dragIndex === i ? 'border-primary' : 'border-border'
                } ${s.visible ? '' : 'opacity-50'}`}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm flex-1 truncate">{labelOf(s.id)}</span>
                <span className="text-[11px] text-muted-foreground">{i + 1}</span>
                <button
                  onClick={() =>
                    patch((c) => ({
                      ...c,
                      layout: c.layout.map((x) => (x.id === s.id ? { ...x, visible: !x.visible } : x)),
                    }))
                  }
                  className="p-1.5 rounded hover:bg-muted"
                  title={s.visible ? 'Ocultar seção' : 'Mostrar seção'}
                >
                  {s.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Textos */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading text-lg mb-4 flex items-center gap-2">
            <TypeIcon className="w-4 h-4 text-primary" /> Títulos das seções
          </h2>
          <div className="space-y-3">
            {SECTION_DEFS.map((def) => (
              <div key={def.id}>
                <label className="text-xs text-muted-foreground">{def.label}</label>
                <input
                  value={draft.texts[def.id]?.title ?? ''}
                  onChange={(e) =>
                    patch((c) => ({
                      ...c,
                      texts: { ...c.texts, [def.id]: { ...c.texts[def.id], title: e.target.value } },
                    }))
                  }
                  className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm"
                />
                {def.id === 'hero' && (
                  <input
                    value={draft.texts.hero?.subtitle ?? ''}
                    onChange={(e) =>
                      patch((c) => ({
                        ...c,
                        texts: { ...c.texts, hero: { ...c.texts.hero, subtitle: e.target.value } },
                      }))
                    }
                    placeholder="Subtítulo da capa"
                    className="w-full mt-2 bg-background border border-border rounded-lg px-3 py-2 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cores e tipografia */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h2 className="font-heading text-lg flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" /> Foto da capa (Início)
          </h2>
          <p className="text-xs text-muted-foreground">
            Envie uma foto (JPG/PNG/WebP, até 8MB). Você recorta em 16:9 antes de publicar.
          </p>
          <div className="relative group rounded-lg overflow-hidden border border-border">
            <img
              src={draft.theme.heroImage || defaultHeroImage}
              alt="Foto atual da capa do site"
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs font-medium"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Trocar foto
              </button>
              {draft.theme.heroImage && (
                <button
                  onClick={() => patch((c) => ({ ...c, theme: { ...c.theme, heroImage: '' } }))}
                  className="inline-flex items-center gap-2 bg-background text-foreground px-3 py-2 rounded-lg text-xs font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Restaurar padrão
                </button>
              )}
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              onPickFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
        </div>

        {/* Marca / logo */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h2 className="font-heading text-lg flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" /> Marca e rodapé
          </h2>
          <div className="flex items-center gap-3">
            <img src={draft.brand.logo} alt="Logo atual" className="h-12 w-auto object-contain bg-muted rounded p-1" />
            <button
              onClick={() => logoFileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-xs hover:bg-muted"
            >
              <Upload className="w-4 h-4" /> Trocar logo
            </button>
            <input
              ref={logoFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                onPickLogo(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Frase do rodapé</label>
            <textarea
              rows={2}
              value={draft.brand.tagline}
              onChange={(e) => patch((c) => ({ ...c, brand: { ...c.brand, tagline: e.target.value } }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Texto de copyright</label>
            <input
              value={draft.brand.copyright}
              onChange={(e) => patch((c) => ({ ...c, brand: { ...c.brand, copyright: e.target.value } }))}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Crédito (nome)</label>
              <input
                value={draft.brand.credit}
                onChange={(e) => patch((c) => ({ ...c, brand: { ...c.brand, credit: e.target.value } }))}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Crédito (link)</label>
              <input
                value={draft.brand.creditUrl}
                onChange={(e) => patch((c) => ({ ...c, brand: { ...c.brand, creditUrl: e.target.value } }))}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h2 className="font-heading text-lg flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" /> Dados de contato
          </h2>
          <p className="text-xs text-muted-foreground">
            Usados no menu, na seção Contato, no rodapé e no botão de WhatsApp.
          </p>
          {CONTACT_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="text-xs text-muted-foreground">{f.label}</label>
              <input
                value={draft.contact[f.key] ?? ''}
                placeholder={f.placeholder}
                onChange={(e) => patch((c) => ({ ...c, contact: { ...c.contact, [f.key]: e.target.value } }))}
                className={inputCls}
              />
            </div>
          ))}
        </div>

        {/* Redes sociais */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h2 className="font-heading text-lg flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" /> Redes sociais (rodapé)
          </h2>
          {draft.socials.map((s, i) => (
            <div key={i} className="border border-border rounded-lg p-3 space-y-2">
              <div className="flex gap-2">
                <select
                  value={s.icon}
                  onChange={(e) =>
                    patch((c) => ({
                      ...c,
                      socials: c.socials.map((x, j) => (j === i ? { ...x, icon: e.target.value as SocialIcon } : x)),
                    }))
                  }
                  className="bg-background border border-border rounded-lg px-2 py-2 text-sm"
                >
                  {SOCIAL_ICON_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <input
                  value={s.label}
                  placeholder="Nome"
                  onChange={(e) =>
                    patch((c) => ({
                      ...c,
                      socials: c.socials.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)),
                    }))
                  }
                  className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={() => patch((c) => ({ ...c, socials: c.socials.filter((_, j) => j !== i) }))}
                  className="p-2 rounded-lg border border-border hover:bg-muted"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input
                value={s.url}
                placeholder="https://... (vazio usa WhatsApp/E-mail do contato)"
                onChange={(e) =>
                  patch((c) => ({
                    ...c,
                    socials: c.socials.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)),
                  }))
                }
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          ))}
          <button
            onClick={() =>
              patch((c) => ({ ...c, socials: [...c.socials, { label: 'Nova rede', url: '', icon: 'site' }] }))
            }
            className="inline-flex items-center gap-2 text-sm border border-border rounded-lg px-3 py-2 hover:bg-muted"
          >
            <Plus className="w-4 h-4" /> Adicionar rede
          </button>
        </div>

        {/* Sobre */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h2 className="font-heading text-lg flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Seção "Sobre"
          </h2>
          <div className="flex items-center gap-3">
            <img src={draft.about.image} alt="Foto do Sobre" className="w-16 h-16 rounded-full object-cover" />
            <button
              onClick={() => aboutFileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-xs hover:bg-muted"
            >
              <Upload className="w-4 h-4" /> Trocar foto
            </button>
            <input
              ref={aboutFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                onPickFile(e.target.files?.[0], 'about');
                e.target.value = '';
              }}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Texto principal</label>
            <textarea
              rows={10}
              value={draft.about.text}
              onChange={(e) => patch((c) => ({ ...c, about: { ...c.about, text: e.target.value } }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Frase de encerramento</label>
            <input
              value={draft.about.closing}
              onChange={(e) => patch((c) => ({ ...c, about: { ...c.about, closing: e.target.value } }))}
              className={inputCls}
            />
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h2 className="font-heading text-lg flex items-center gap-2">
            <TypeIcon className="w-4 h-4 text-primary" /> Formulário de contato
          </h2>
          <div>
            <label className="text-xs text-muted-foreground">Assuntos (um por linha)</label>
            <textarea
              rows={8}
              value={draft.form.services.join('\n')}
              onChange={(e) =>
                patch((c) => ({
                  ...c,
                  form: { ...c.form, services: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) },
                }))
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Texto do botão</label>
            <input
              value={draft.form.buttonLabel}
              onChange={(e) => patch((c) => ({ ...c, form: { ...c.form, buttonLabel: e.target.value } }))}
              className={inputCls}
            />
          </div>
        </div>

        {/* Chat WhatsApp */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h2 className="font-heading text-lg flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" /> Balão de WhatsApp
          </h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.chat.enabled}
              onChange={(e) => patch((c) => ({ ...c, chat: { ...c.chat, enabled: e.target.checked } }))}
              className="accent-primary w-4 h-4"
            />
            Mostrar o balão flutuante no site
          </label>
          {([
            ['bubble', 'Frase do balão'],
            ['name', 'Nome exibido'],
            ['status', 'Status (ex.: Online agora)'],
            ['buttonLabel', 'Texto do botão'],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <label className="text-xs text-muted-foreground">{label}</label>
              <input
                value={draft.chat[key]}
                onChange={(e) => patch((c) => ({ ...c, chat: { ...c.chat, [key]: e.target.value } }))}
                className={inputCls}
              />
            </div>
          ))}
          <div>
            <label className="text-xs text-muted-foreground">Mensagem de boas-vindas</label>
            <textarea
              rows={4}
              value={draft.chat.greeting}
              onChange={(e) => patch((c) => ({ ...c, chat: { ...c.chat, greeting: e.target.value } }))}
              className={inputCls}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-5">
          <h2 className="font-heading text-lg flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" /> Cores e estilo
          </h2>

          <div className="flex flex-wrap gap-2">
            {PALETTES.map((p) => (
              <button
                key={p.label}
                onClick={() =>
                  patch((c) => ({
                    ...c,
                    theme: {
                      ...c.theme,
                      primary: p.primary,
                      background: p.background,
                      foreground: p.foreground,
                      muted: p.muted,
                    },
                  }))
                }
                className="flex items-center gap-2 border border-border rounded-lg px-2.5 py-1.5 text-xs hover:bg-muted"
              >
                <span className="w-3.5 h-3.5 rounded-full" style={{ background: p.primary }} />
                {p.label}
              </button>
            ))}
          </div>

          {COLOR_FIELDS.map((f) => (
            <div key={f.key} className="flex items-center justify-between gap-3">
              <label className="text-sm">{f.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={draft.theme[f.key]}
                  onChange={(e) => patch((c) => ({ ...c, theme: { ...c.theme, [f.key]: e.target.value } }))}
                  className="w-24 bg-background border border-border rounded-lg px-2 py-1.5 text-xs font-mono uppercase"
                />
                <input
                  type="color"
                  value={draft.theme[f.key]}
                  onChange={(e) => patch((c) => ({ ...c, theme: { ...c.theme, [f.key]: e.target.value } }))}
                  className="w-10 h-9 rounded border border-border bg-background cursor-pointer"
                />
              </div>
            </div>
          ))}

          <div>
            <label className="text-sm">Fonte do site</label>
            <select
              value={draft.theme.font}
              onChange={(e) => patch((c) => ({ ...c, theme: { ...c.theme, font: e.target.value } }))}
              className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm flex justify-between">
              Arredondamento dos cantos <span className="text-muted-foreground">{draft.theme.radius}px</span>
            </label>
            <input
              type="range"
              min={0}
              max={24}
              value={draft.theme.radius}
              onChange={(e) => patch((c) => ({ ...c, theme: { ...c.theme, radius: Number(e.target.value) } }))}
              className="w-full mt-2 accent-primary"
            />
          </div>

          <div>
            <label className="text-sm flex justify-between">
              Escurecimento da imagem de capa <span className="text-muted-foreground">{draft.theme.heroOverlay}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={80}
              value={draft.theme.heroOverlay}
              onChange={(e) => patch((c) => ({ ...c, theme: { ...c.theme, heroOverlay: Number(e.target.value) } }))}
              className="w-full mt-2 accent-primary"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-card border border-border rounded-xl p-4 xl:sticky xl:top-4 h-fit">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium">Pré-visualização ao vivo</p>
            <p className="text-xs text-muted-foreground">
              É assim que o visitante vê. Publique para valer nas mudanças.
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setDevice('desktop')}
              title="Ver como fica no computador"
              className={`p-2 rounded-lg border ${device === 'desktop' ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              title="Ver como fica no celular"
              className={`p-2 rounded-lg border ${device === 'mobile' ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div ref={previewBoxRef} className="w-full">
          {(() => {
            const frameWidth = device === 'mobile' ? 390 : DESKTOP_PREVIEW_WIDTH;
            const frameHeight = device === 'mobile' ? 844 : 900;
            const scale = boxWidth > 0 ? Math.min(1, boxWidth / frameWidth) : 0;
            if (!scale) return <div className="bg-muted rounded-lg h-[520px]" />;
            return (
              <div
                className="bg-muted rounded-lg overflow-hidden mx-auto"
                style={{
                  width: frameWidth * scale,
                  height: frameHeight * scale,
                }}
              >
                <iframe
                  ref={iframeRef}
                  title="Pré-visualização do site"
                  src="/"
                  onLoad={() => setReady(true)}
                  className="bg-background border-0 block"
                  style={{
                    width: frameWidth,
                    height: frameHeight,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                  }}
                />
              </div>
            );
          })()}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Dica: no modo computador o menu aparece escrito no topo; no celular ele vira o botão de três
          risquinhos. Role a pré-visualização para ver o site inteiro.
        </p>
      </div>

      {cropFile && (
        <ImageCropModal
          file={cropFile}
          maxWidth={cropTarget === 'about' ? 800 : 1920}
          aspectRatio={cropTarget === 'about' ? 1 : 16 / 9}
          onConfirm={onCropConfirm}
          onCancel={() => setCropFile(null)}
        />
      )}
    </div>
  );
}
