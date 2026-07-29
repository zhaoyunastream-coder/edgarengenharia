import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Facebook, Globe, Instagram, Building2 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { linksUteis } from '@/data/site-content';
import { supabase } from '@/integrations/supabase/client';

function metaFor(label: string, href: string) {
  const host = (() => {
    try {
      return new URL(href).hostname.replace(/^www\./, '');
    } catch {
      return href;
    }
  })();

  if (/instagram/i.test(label)) return { Icon: Instagram, title: label.replace(/^Instagram\s*-\s*/i, ''), sub: 'Instagram' };
  if (/facebook/i.test(label)) return { Icon: Facebook, title: label.replace(/^Facebook\s*-\s*/i, ''), sub: 'Facebook' };
  if (/crea|creci/i.test(label)) return { Icon: Building2, title: label, sub: 'Órgão oficial' };
  return { Icon: Globe, title: label, sub: host };
}

export default function LinksUteisSection({ title = "Links Úteis" }: { title?: string }) {
  const { data } = useQuery({
    queryKey: ['site-items', 'links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_items')
        .select('title, link_url')
        .eq('section', 'links')
        .eq('published', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? [])
        .filter((r) => !!r.link_url)
        .map((r) => ({ label: r.title as string, href: r.link_url as string }));
    },
    staleTime: 60_000,
  });

  const links = data && data.length > 0 ? data : linksUteis;

  return (
    <section id="links-uteis" className="py-16 md:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <SectionHeading title={title} />

        <ul className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((l) => {
            const { Icon, title, sub } = metaFor(l.label, l.href);
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group card-ref h-full flex items-start gap-3 p-4 hover:-translate-y-0.5"
                >
                  <span className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="w-[18px] h-[18px]" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {title}
                    </span>
                    <span className="block text-xs text-muted-foreground truncate mt-0.5">{sub}</span>
                  </span>

                  <ArrowUpRight className="w-4 h-4 shrink-0 text-muted-foreground/60 transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}