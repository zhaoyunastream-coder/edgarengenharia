import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Eye, MousePointerClick, Globe, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data — será substituído por dados reais do GA4
const mockVisitors7Days = [
  { day: '24/03', visitors: 42 },
  { day: '25/03', visitors: 58 },
  { day: '26/03', visitors: 35 },
  { day: '27/03', visitors: 71 },
  { day: '28/03', visitors: 63 },
  { day: '29/03', visitors: 49 },
  { day: '30/03', visitors: 82 },
];

const mockConversions = [
  { event: 'conversion_whatsapp', label: 'Cliques no WhatsApp', count: 47 },
  { event: 'conversion_formulario', label: 'Formulários enviados', count: 12 },
];

const mockPages = [
  { path: '/', label: 'Home', views: 324 },
  { path: '/blog', label: 'Blog', views: 156 },
  { path: '/contato', label: 'Contato', views: 89 },
];

const mockTrafficSources = [
  { source: 'Orgânico', sessions: 198, icon: Globe },
  { source: 'Google Ads (CPC)', sessions: 87, icon: MousePointerClick },
  { source: 'Direto', sessions: 64, icon: Users },
  { source: 'Social', sessions: 51, icon: TrendingUp },
];

const summaryCards = [
  { title: 'Visitantes hoje', value: 82, icon: Users },
  { title: 'Visitantes esta semana', value: 400, icon: Eye },
  { title: 'Total de sessões', value: 1247, icon: Globe },
  { title: 'Conversões', value: 59, icon: MousePointerClick },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Dados simulados — conecte ao GA4 para dados reais
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{card.title}</p>
                  <p className="text-3xl font-heading text-foreground mt-1">{card.value.toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visitors Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Visitantes — Últimos 7 dias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockVisitors7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 16%)" />
                <XAxis dataKey="day" stroke="hsl(215 17% 63%)" fontSize={12} />
                <YAxis stroke="hsl(215 17% 63%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(225 18% 8%)',
                    border: '1px solid hsl(220 15% 16%)',
                    borderRadius: '8px',
                    color: 'hsl(213 31% 95%)',
                    fontSize: '13px',
                  }}
                  labelStyle={{ color: 'hsl(215 17% 63%)' }}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="hsl(38 92% 50%)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(38 92% 50%)', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Visitantes"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Events */}
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
                {mockConversions.map((conv) => (
                  <TableRow key={conv.event} className="border-border">
                    <TableCell>
                      <div>
                        <p className="text-sm text-foreground">{conv.label}</p>
                        <p className="text-xs text-muted-foreground font-mono">{conv.event}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-lg font-heading text-primary">{conv.count}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Pages */}
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
                {mockPages.map((page) => (
                  <TableRow key={page.path} className="border-border">
                    <TableCell>
                      <div>
                        <p className="text-sm text-foreground">{page.label}</p>
                        <p className="text-xs text-muted-foreground font-mono">{page.path}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-lg font-heading text-primary">{page.views}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Origem do Tráfego</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockTrafficSources.map((source) => (
              <div
                key={source.source}
                className="rounded-lg border border-border bg-muted/30 p-4 flex items-center gap-3"
              >
                <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <source.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground font-medium">{source.source}</p>
                  <p className="text-xs text-muted-foreground">{source.sessions} sessões</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
