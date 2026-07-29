import { supabase } from '@/integrations/supabase/client';

const SESSION_KEY = 'edgar_analytics_session';

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

/** Classifica a origem do tráfego a partir da URL e do referrer. */
export function detectSource(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('gclid') || params.get('utm_medium') === 'cpc') return 'Google Ads (CPC)';
    const utm = params.get('utm_source');
    if (utm) return utm;

    const ref = document.referrer;
    if (!ref) return 'Direto';
    const host = new URL(ref).hostname.replace('www.', '');
    if (host === window.location.hostname) return 'Interno';
    if (host.includes('google')) return 'Orgânico (Google)';
    if (host.includes('bing') || host.includes('duckduckgo') || host.includes('yahoo')) return 'Orgânico';
    if (
      host.includes('instagram') ||
      host.includes('facebook') ||
      host.includes('linkedin') ||
      host.includes('youtube') ||
      host.includes('whatsapp') ||
      host.includes('t.co')
    )
      return 'Social';
    return `Referência (${host})`;
  } catch {
    return 'Direto';
  }
}

function device(): string {
  if (typeof window === 'undefined') return 'desconhecido';
  const w = window.innerWidth;
  if (w < 640) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function shouldSkip(path: string) {
  if (typeof window === 'undefined') return true;
  if (path.startsWith('/admin')) return true;
  if (window.self !== window.top) return true; // preview do editor
  if (window.location.hostname === 'localhost') return false;
  return false;
}

async function send(row: Record<string, unknown>) {
  try {
    await supabase.from('site_analytics_events').insert(row);
  } catch {
    /* analytics nunca deve quebrar o site */
  }
}

export function trackPageview(path: string, title?: string) {
  if (shouldSkip(path)) return;
  void send({
    type: 'pageview',
    path,
    page_title: title ?? document.title,
    referrer: document.referrer || null,
    source: detectSource(),
    session_id: getSessionId(),
    device: device(),
  });
}

export function trackEvent(eventName: string, path?: string) {
  const p = path ?? window.location.pathname;
  if (shouldSkip(p)) return;
  void send({
    type: 'event',
    event_name: eventName,
    path: p,
    page_title: document.title,
    referrer: document.referrer || null,
    source: detectSource(),
    session_id: getSessionId(),
    device: device(),
  });
}
