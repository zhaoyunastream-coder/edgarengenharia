import { ExternalLink } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { linksUteis } from '@/data/site-content';

export default function LinksUteisSection() {
  return (
    <section id="links-uteis" className="py-16 md:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <SectionHeading title="Links Úteis" />

        <ul className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-3">
          {linksUteis.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-ref flex items-center gap-3 px-4 py-3 text-[15px] text-foreground/85 hover:text-primary break-all"
              >
                <ExternalLink className="w-4 h-4 text-primary shrink-0" />
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}