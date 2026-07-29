import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Eye,
  EyeOff,
  GripVertical,
  Loader2,
  Monitor,
  Palette,
  RotateCcw,
  Save,
  Smartphone,
  Type as TypeIcon,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  DEFAULT_CONFIG,
  FONT_OPTIONS,
  SECTION_DEFS,
  fetchSiteConfig,
  saveSiteConfig,
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

export default function SiteAppearanceEditor() {
  const qc = useQueryClient();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [draft, setDraft] = useState<SiteConfig | null>(null);
  const [ready, setReady] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

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
        <div className="bg-card border border-border rounded-xl p-5 space-y-5">
          <h2 className="font-heading text-lg flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" /> Cores e estilo
          </h2>

          <div className="flex flex-wrap gap-2">
            {PALETTES.map((p) => (
              <button
                key={p.label}
                onClick={() => patch((c) => ({ ...c, theme: { ...c.theme, ...p, label: undefined } as typeof c.theme }))}
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
          <p className="text-sm text-muted-foreground">Pré-visualização ao vivo</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-lg border ${device === 'desktop' ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-lg border ${device === 'mobile' ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="bg-muted rounded-lg overflow-hidden flex justify-center">
          <iframe
            ref={iframeRef}
            title="Pré-visualização do site"
            src="/"
            onLoad={() => setReady(true)}
            className="bg-background border-0"
            style={{
              width: device === 'mobile' ? 390 : '100%',
              height: 'calc(100vh - 200px)',
              minHeight: 600,
            }}
          />
        </div>
      </div>
    </div>
  );
}
