import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageview } from '@/lib/site-analytics';

/** Registra cada visualização de página no analytics próprio (Supabase). */
export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const t = window.setTimeout(() => trackPageview(location.pathname), 300);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  return null;
}
