import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  contato as CONTATO_PADRAO,
  logoImage as LOGO_PADRAO,
  sobreImage as SOBRE_IMG_PADRAO,
  sobreTexto as SOBRE_TEXTO_PADRAO,
} from '@/data/site-content';

export type SectionId =
  | 'hero'
  | 'servicos'
  | 'imoveis'
  | 'cursos'
  | 'marketplace'
  | 'vocesabia'
  | 'sobre'
  | 'blog'
  | 'contato'
  | 'links';

export interface SectionDef {
  id: SectionId;
  label: string;
  defaultTitle: string;
  fixed?: boolean;
}

export const SECTION_DEFS: SectionDef[] = [
  { id: 'hero', label: 'Início (capa)', defaultTitle: 'Edgar Alexandre Kmiecik', fixed: true },
  { id: 'servicos', label: 'Serviços', defaultTitle: 'Serviços' },
  { id: 'imoveis', label: 'Imóveis', defaultTitle: 'Imóveis' },
  { id: 'cursos', label: 'Cursos', defaultTitle: 'Cursos' },
  { id: 'marketplace', label: 'Marketplace', defaultTitle: 'Marketplace' },
  { id: 'vocesabia', label: 'Você sabia', defaultTitle: 'Você sabia ???' },
  { id: 'sobre', label: 'Sobre', defaultTitle: 'Sobre' },
  { id: 'blog', label: 'Blog', defaultTitle: 'Blog' },
  { id: 'contato', label: 'Contato', defaultTitle: 'Contato' },
  { id: 'links', label: 'Links Úteis', defaultTitle: 'Links Úteis' },
];

export interface LayoutSection {
  id: SectionId;
  visible: boolean;
}

export interface SiteTheme {
  primary: string;
  background: string;
  foreground: string;
  muted: string;
  radius: number;
  font: string;
  heroOverlay: number;
  heroImage: string;
}

export interface SectionText {
  title?: string;
  subtitle?: string;
}

export interface SiteConfig {
  layout: LayoutSection[];
  theme: SiteTheme;
  texts: Record<string, SectionText>;
  brand: SiteBrand;
  contact: SiteContact;
  socials: SiteSocial[];
  about: SiteAbout;
  chat: SiteChat;
  form: SiteForm;
}

/* ---------- conteúdo editável ---------- */

export interface SiteBrand {
  logo: string;
  tagline: string;
  copyright: string;
  credit: string;
  creditUrl: string;
}

export interface SiteContact {
  endereco: string;
  mapa: string;
  whatsapp: string;
  telefone: string;
  email: string;
  horario: string;
  crea: string;
  creci: string;
}

export type SocialIcon = 'facebook' | 'instagram' | 'whatsapp' | 'email' | 'linkedin' | 'youtube' | 'site';

export interface SiteSocial {
  label: string;
  url: string;
  icon: SocialIcon;
}

export interface SiteAbout {
  image: string;
  text: string;
  closing: string;
}

export interface SiteChat {
  enabled: boolean;
  bubble: string;
  name: string;
  status: string;
  greeting: string;
  buttonLabel: string;
}

export interface SiteForm {
  services: string[];
  buttonLabel: string;
}

export const DEFAULT_BRAND: SiteBrand = {
  logo: LOGO_PADRAO,
  tagline: 'Engenharia Civil e corretagem de imóveis em Carazinho/RS e região.',
  copyright: 'Engenheiro Edgar. Todos os direitos reservados.',
  credit: 'agenciafw.com.br',
  creditUrl: 'https://agenciafw.com.br/',
};

export const DEFAULT_CONTACT: SiteContact = {
  endereco: CONTATO_PADRAO.endereco,
  mapa: CONTATO_PADRAO.mapa,
  whatsapp: CONTATO_PADRAO.whatsapp,
  telefone: CONTATO_PADRAO.telefone,
  email: CONTATO_PADRAO.email,
  horario: CONTATO_PADRAO.horario,
  crea: CONTATO_PADRAO.crea,
  creci: CONTATO_PADRAO.creci,
};

export const DEFAULT_SOCIALS: SiteSocial[] = [
  { label: 'Facebook', url: 'https://www.facebook.com/edgarkmiecik1', icon: 'facebook' },
  { label: 'Instagram', url: 'https://www.instagram.com/engenheiroedgar/', icon: 'instagram' },
  { label: 'WhatsApp', url: '', icon: 'whatsapp' },
  { label: 'E-mail', url: '', icon: 'email' },
];

export const DEFAULT_ABOUT: SiteAbout = {
  image: SOBRE_IMG_PADRAO,
  text: SOBRE_TEXTO_PADRAO,
  closing: 'Entre em contato, que terei o maior prazer em lhe atender.',
};

export const DEFAULT_CHAT: SiteChat = {
  enabled: true,
  bubble: '👋 Como posso ajudar você hoje?',
  name: 'Engenheiro Edgar',
  status: 'Online agora',
  greeting:
    'Olá! 👋 Sou o Edgar, Engenheiro Civil. Como posso te ajudar hoje? Fique à vontade para perguntar sobre nossos serviços, projetos ou tirar qualquer dúvida!',
  buttonLabel: '💬 Falar no WhatsApp',
};

export const DEFAULT_FORM: SiteForm = {
  services: [
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
    'Marketplace',
    'Outro',
  ],
  buttonLabel: 'Enviar',
};

/** Links derivados dos dados de contato. */
const onlyDigits = (v: string) => (v || '').replace(/\D/g, '');

export const waHref = (c: SiteContact, text?: string) => {
  const n = onlyDigits(c.whatsapp);
  const base = `https://wa.me/${n.length > 11 ? n : `55${n}`}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
};

export const telHref = (c: SiteContact) => `tel:+${onlyDigits(c.telefone)}`;

export const mapHref = (c: SiteContact) =>
  c.mapa?.trim() ? c.mapa : `https://maps.google.com/?q=${encodeURIComponent(c.endereco || '')}`;

export const socialHref = (s: SiteSocial, c: SiteContact) => {
  if (s.url?.trim()) return s.url;
  if (s.icon === 'whatsapp') return waHref(c);
  if (s.icon === 'email') return `mailto:${c.email}`;
  return '#';
};

export const DEFAULT_THEME: SiteTheme = {
  primary: '#2CCFD8',
  background: '#FFFFFF',
  foreground: '#252525',
  muted: '#F6F6F6',
  radius: 4,
  font: 'Open Sans',
  heroOverlay: 35,
  heroImage: '',
};

export const FONT_OPTIONS = ['Open Sans', 'Inter', 'Montserrat', 'Poppins', 'Roboto', 'Lato', 'Raleway'];

export const DEFAULT_LAYOUT: LayoutSection[] = SECTION_DEFS.map((s) => ({ id: s.id, visible: true }));

export const DEFAULT_TEXTS: Record<string, SectionText> = {
  hero: { title: 'Edgar Alexandre Kmiecik', subtitle: 'Engenheiro Civil' },
  ...Object.fromEntries(SECTION_DEFS.filter((s) => s.id !== 'hero').map((s) => [s.id, { title: s.defaultTitle }])),
};

export const DEFAULT_CONFIG: SiteConfig = {
  layout: DEFAULT_LAYOUT,
  theme: DEFAULT_THEME,
  texts: DEFAULT_TEXTS,
  brand: DEFAULT_BRAND,
  contact: DEFAULT_CONTACT,
  socials: DEFAULT_SOCIALS,
  about: DEFAULT_ABOUT,
  chat: DEFAULT_CHAT,
  form: DEFAULT_FORM,
};

/* ---------- cores ---------- */

export function hexToHsl(hex: string): string {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function luminance(hex: string) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const loadedFonts = new Set<string>();
function loadFont(font: string) {
  if (font === 'Open Sans' || loadedFonts.has(font)) return;
  loadedFonts.add(font);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@300;400;600;700;800&display=swap`;
  document.head.appendChild(link);
}

/** Aplica o tema como variáveis CSS no documento. */
export function applyTheme(theme: SiteTheme) {
  const root = document.documentElement;
  const contrast = (hex: string) => (luminance(hex) > 0.6 ? '0 0% 10%' : '0 0% 100%');
  root.style.setProperty('--primary', hexToHsl(theme.primary));
  root.style.setProperty('--primary-foreground', contrast(theme.primary));
  root.style.setProperty('--accent', hexToHsl(theme.primary));
  root.style.setProperty('--accent-foreground', contrast(theme.primary));
  root.style.setProperty('--ring', hexToHsl(theme.primary));
  root.style.setProperty('--background', hexToHsl(theme.background));
  root.style.setProperty('--card', hexToHsl(theme.background));
  root.style.setProperty('--popover', hexToHsl(theme.background));
  root.style.setProperty('--foreground', hexToHsl(theme.foreground));
  root.style.setProperty('--card-foreground', hexToHsl(theme.foreground));
  root.style.setProperty('--popover-foreground', hexToHsl(theme.foreground));
  root.style.setProperty('--muted', hexToHsl(theme.muted));
  root.style.setProperty('--secondary', hexToHsl(theme.muted));
  root.style.setProperty('--radius', `${theme.radius}px`);
  root.style.setProperty('--hero-overlay', String(theme.heroOverlay / 100));
  loadFont(theme.font);
  root.style.setProperty('--font-site', `'${theme.font}', system-ui, sans-serif`);
  document.body.style.fontFamily = `var(--font-site)`;
}

/* ---------- carregamento ---------- */

function merge(raw: Partial<SiteConfig> | null | undefined): SiteConfig {
  const layoutRaw = raw?.layout;
  const known = new Map(SECTION_DEFS.map((s) => [s.id, s]));
  const layout: LayoutSection[] = Array.isArray(layoutRaw)
    ? layoutRaw.filter((s) => known.has(s.id)).map((s) => ({ id: s.id, visible: s.visible !== false }))
    : [];
  DEFAULT_LAYOUT.forEach((d) => {
    if (!layout.some((s) => s.id === d.id)) layout.push(d);
  });
  return {
    layout,
    theme: { ...DEFAULT_THEME, ...(raw?.theme ?? {}) },
    texts: { ...DEFAULT_TEXTS, ...(raw?.texts ?? {}) },
    brand: { ...DEFAULT_BRAND, ...(raw?.brand ?? {}) },
    contact: { ...DEFAULT_CONTACT, ...(raw?.contact ?? {}) },
    socials: Array.isArray(raw?.socials) ? raw!.socials : DEFAULT_SOCIALS,
    about: { ...DEFAULT_ABOUT, ...(raw?.about ?? {}) },
    chat: { ...DEFAULT_CHAT, ...(raw?.chat ?? {}) },
    form: {
      ...DEFAULT_FORM,
      ...(raw?.form ?? {}),
      services: Array.isArray(raw?.form?.services) && raw!.form!.services.length
        ? raw!.form!.services
        : DEFAULT_FORM.services,
    },
  };
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'home_design')
    .maybeSingle();
  if (error) throw error;
  return merge((data?.value as Partial<SiteConfig>) ?? null);
}

export async function saveSiteConfig(config: SiteConfig) {
  const { error } = await supabase
    .from('site_settings')
    .upsert(
      [
        {
          key: 'home_design',
          value: JSON.parse(JSON.stringify(config)),
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: 'key' },
    );
  if (error) throw error;
}

/**
 * Configuração visual do site. Dentro do preview do editor (iframe),
 * aceita atualizações ao vivo via postMessage.
 */
export function useSiteConfig() {
  const query = useQuery({ queryKey: ['site-config'], queryFn: fetchSiteConfig, staleTime: 30_000 });
  const [preview, setPreview] = useState<SiteConfig | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || window.self === window.top) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === 'edgar-site-preview' && e.data.config) setPreview(merge(e.data.config));
    };
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: 'edgar-site-preview-ready' }, window.location.origin);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const config = preview ?? query.data ?? DEFAULT_CONFIG;

  useEffect(() => {
    applyTheme(config.theme);
  }, [config.theme]);

  return { config, isLoading: query.isLoading };
}

export const textOf = (config: SiteConfig, id: SectionId, field: keyof SectionText = 'title') =>
  config.texts?.[id]?.[field] ?? DEFAULT_TEXTS[id]?.[field] ?? '';

/* ---------- navegação derivada do layout ---------- */

const SECTION_ANCHORS: Record<SectionId, string> = {
  hero: '/#inicio',
  servicos: '/#servicos',
  imoveis: '/#imoveis',
  cursos: '/#cursos',
  marketplace: '/#marketplace',
  vocesabia: '/#voce-sabia',
  sobre: '/#sobre',
  blog: '/blog',
  contato: '/#contato',
  links: '/#links-uteis',
};

const NAV_LABEL_OVERRIDES: Partial<Record<SectionId, string>> = {
  hero: 'Início',
  blog: 'Blog',
};

export interface NavItem {
  id: SectionId;
  label: string;
  href: string;
}

/** Links de menu (navbar/rodapé) apenas das seções visíveis, na ordem do layout. */
export function navItemsFrom(config: SiteConfig): NavItem[] {
  return config.layout
    .filter((s) => s.visible)
    .map((s) => ({
      id: s.id,
      label: NAV_LABEL_OVERRIDES[s.id] ?? textOf(config, s.id) ?? s.id,
      href: SECTION_ANCHORS[s.id],
    }))
    .filter((i) => Boolean(i.href));
}
