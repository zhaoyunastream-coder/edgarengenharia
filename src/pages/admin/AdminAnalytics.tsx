import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Eye, MousePointerClick, Globe, Loader2, RefreshCw, Smartphone } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface EventRow {
  type: string;
  event_name: string | null;
  path: string;
  page_title: string | null;
  source: string;
  session_id: string | null;
  device: string | null;
  created_at: string;
}

const RANGES = [
  { days: 7, label: '7 dias' },
  { days: 30, label: '30 dias' },
  { days: 90, label: '90 dias' },
];

const EVENT_LABELS: Record<string, string> = {
  conversion_whatsapp: 'Cliques no WhatsApp',
  conversion_formulario: 'Formulários enviados',
};

const dayKey = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

export default function AdminAnalytics() {
  const [days, setDays] = useState(7);

  const { data: rows = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ['analytics-events', days],
    queryFn: async () => {
      const since = new Date(Date.now() - days * 86400000).toISOString();
      const { data, error } = await supabase
        .from('site_analytics_events')
        .select('type,event_name,path,page_title,source,session_id,device,created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(10000);
      if (error) throw error;
      return (data ?? []) as EventRow[];
    },
    refetchInterval: 60_000,
  });

  const stats = useMemo(() => {
    const pageviews = rows.filter((r) => r.type === 'pageview');
    const events = rows.filter((r) => r.type === 'event');
    const todayStr = new Date().toDateString();

    const uniq = (list: EventRow[]) => new Set(list.map((r) => r.session_id ?? r.created_at)).size;
    const todayViews = pageviews.filter((r) => new Date(r.created_at).toDateString() === todayStr);

    const series: { day: string; visitors: number; views: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const dayRows = pageviews.filter((r) => dayKey(r.created_at) === key);
      series.push({ day: key, visitors: uniq(dayRows), views: dayRows.length });
    }

    const group = (list: EventRow[], keyFn: (r: EventRow) => string) => {
      const map = new Map<string, number>();
      list.forEach((r) => {
        const k = keyFn(r);
        map.set(k, (map.get(k) ?? 0) + 1);
      });
      return [...map.entries()].sort((a, b) => b[1] - a[1]);
    };

    return {
      todayVisitors: uniq(todayViews),
      periodVisitors: uniq(pageviews),
      totalViews: pageviews.length,
      conversions: events.length,
      series,
      pages: group(pageviews, (r) => r.path).slice(0, 10),
      pageTitles: new Map(pageviews.map((r) => [r.path, r.page_title ?? r.path])),
      sources: group(pageviews, (r) => r.source || 'Direto').slice(0, 8),
      devices: group(pageviews, (r) => r.device ?? 'desconhecido'),
      events: group(events, (r) => r.event_name ?? 'evento'),
    };
  }, [rows, days]);

  const cards = [
    { title: 'Visitantes hoje', value: stats.todayVisitors, icon: Users },
    { title: `Visitantes (${days}d)`, value: stats.periodVisitors, icon: Eye },
    { title: 'Visualizações de página', value: stats.totalViews, icon: Globe },
    { title: 'Conversões', value: stats.conversions, icon: MousePointerClick },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Dados reais do seu site, coletados no seu próprio banco de dados.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                days === r.days
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {r.label}
            </button>
          ))}
          <button
            onClick={() => refetch()}
            className="p-2 rounded-lg border border-border hover:bg-muted"
            title="Atualizar"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
              <Card key={card.title} className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{card.title}</p>
                      <p className="text-3xl font-heading text-foreground mt-1">{card.value.toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <card.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {rows.length === 0 && (
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              Ainda não há visitas registradas neste período. Os dados aparecem aqui automaticamente conforme as
              pessoas acessarem o site publicado (acessos ao painel não são contados).
            </div>
          )}

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Visitantes por dia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.series}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                        fontSize: '13px',
                      }}
                    />
                    <Line type="monotone" dataKey="visitors" name="Visitantes" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="views" name="Páginas vistas" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-foreground">Eventos de Conversão</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Evento</TableHead>
                      <TableHead className="text-right text-muted-foreground">Contagem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.events.length === 0 && (
                      <TableRow><TableCell colSpan={2} className="text-sm text-muted-foreground">Nenhuma conversão no período.</TableCell></TableRow>
                    )}
                    {stats.events.map(([name, count]) => (
                      <TableRow key={name} className="border-border">
                        <TableCell>
                          <p className="text-sm text-foreground">{EVENT_LABELS[name] ?? name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{name}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-lg font-heading text-primary">{count}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-foreground">Páginas Mais Acessadas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Página</TableHead>
                      <TableHead className="text-right text-muted-foreground">Views</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.pages.length === 0 && (
                      <TableRow><TableCell colSpan={2} className="text-sm text-muted-foreground">Sem dados no período.</TableCell></TableRow>
                    )}
                    {stats.pages.map(([path, views]) => (
                      <TableRow key={path} className="border-border">
                        <TableCell>
                          <p className="text-sm text-foreground truncate max-w-[240px]">{stats.pageTitles.get(path)}</p>
                          <p className="text-xs text-muted-foreground font-mono">{path}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-lg font-heading text-primary">{views}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-foreground">Origem do Tráfego</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stats.sources.length === 0 && (
                    <p className="text-sm text-muted-foreground">Sem dados no período.</p>
                  )}
                  {stats.sources.map(([source, sessions]) => (
                    <div key={source} className="rounded-lg border border-border bg-muted/30 p-4 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-foreground font-medium truncate">{source}</p>
                        <p className="text-xs text-muted-foreground">{sessions} visitas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-foreground">Dispositivos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {stats.devices.length === 0 && (
                    <p className="text-sm text-muted-foreground">Sem dados no período.</p>
                  )}
                  {stats.devices.map(([device, count]) => (
                    <div key={device} className="rounded-lg border border-border bg-muted/30 p-4 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <Smartphone className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground font-medium capitalize">{device}</p>
                        <p className="text-xs text-muted-foreground">{count} visitas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
