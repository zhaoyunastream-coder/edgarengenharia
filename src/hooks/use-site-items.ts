import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { RefItem } from '@/data/site-content';

export type SiteSection =
  | 'servicos'
  | 'imoveis'
  | 'cursos'
  | 'marketplace'
  | 'vocesabia'
  | 'links';

export interface SiteItem {
  id: string;
  section: string;
  title: string;
  slug: string | null;
  description: string | null;
  image: string | null;
  gallery: string[];
  link_url: string | null;
  cta_label: string | null;
  sort_order: number;
  published: boolean;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

const toGallery = (value: unknown): string[] =>
  Array.isArray(value) ? (value.filter((v) => typeof v === 'string') as string[]) : [];

export const normalizeItem = (row: Record<string, unknown>): SiteItem => ({
  id: String(row.id),
  section: String(row.section),
  title: String(row.title ?? ''),
  slug: (row.slug as string) ?? null,
  description: (row.description as string) ?? null,
  image: (row.image as string) ?? null,
  gallery: toGallery(row.gallery),
  link_url: (row.link_url as string) ?? null,
  cta_label: (row.cta_label as string) ?? null,
  sort_order: Number(row.sort_order ?? 0),
  published: Boolean(row.published),
});

/** Converte itens estáticos (fallback) para o formato do CMS. */
export const fromStatic = (section: SiteSection, items: RefItem[]): SiteItem[] =>
  items.map((it, i) => ({
    id: `static-${section}-${i}`,
    section,
    title: it.title,
    slug: slugify(it.title),
    description: it.desc ?? null,
    image: it.image ?? null,
    gallery: [],
    link_url: null,
    cta_label: null,
    sort_order: i,
    published: true,
  }));

/**
 * Itens públicos de uma seção. Enquanto o editor do site não tiver conteúdo,
 * usa os dados estáticos como fallback.
 */
export function useSiteSection(section: SiteSection, fallback: RefItem[]) {
  const query = useQuery({
    queryKey: ['site-items', section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_items')
        .select('*')
        .eq('section', section)
        .eq('published', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []).map((r) => normalizeItem(r as Record<string, unknown>));
    },
    staleTime: 60_000,
  });

  const items = query.data && query.data.length > 0 ? query.data : fromStatic(section, fallback);
  return { items, isLoading: query.isLoading };
}

/** Um item pelo slug (com fallback estático). */
export function useSiteItem(section: SiteSection, slug: string | undefined, fallback: RefItem[]) {
  const { items, isLoading } = useSiteSection(section, fallback);
  const item = items.find((i) => i.slug === slug) ?? null;
  return { item, isLoading };
}