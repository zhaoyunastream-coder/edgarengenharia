import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, FilePen, Mail, CalendarDays, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['admin-posts-stats'],
    queryFn: async () => {
      const { data } = await supabase.from('blog_posts').select('id, title, slug, published, created_at').order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ['admin-contacts-stats'],
    queryFn: async () => {
      const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const loading = postsLoading || contactsLoading;
  const published = posts?.filter((p) => p.published).length ?? 0;
  const drafts = posts?.filter((p) => !p.published).length ?? 0;
  const totalContacts = contacts?.length ?? 0;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekContacts = contacts?.filter((c) => new Date(c.created_at) >= weekAgo).length ?? 0;

  const stats = [
    { label: 'Posts Publicados', value: published, icon: FileText, color: 'text-primary' },
    { label: 'Rascunhos', value: drafts, icon: FilePen, color: 'text-secondary' },
    { label: 'Total Contatos', value: totalContacts, icon: Mail, color: 'text-primary' },
    { label: 'Contatos esta semana', value: weekContacts, icon: CalendarDays, color: 'text-secondary' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h1 className="font-heading text-3xl">Olá, Edgar! 👋</h1>
        <p className="text-muted-foreground mt-1">Bem-vindo ao painel administrativo.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                </div>
                <p className="font-heading text-3xl">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent contacts */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl">Contatos Recentes</h2>
                <Link to="/admin/contatos" className="text-sm text-primary hover:underline">Ver todos</Link>
              </div>
              {contacts && contacts.length > 0 ? (
                <div className="space-y-3">
                  {contacts.slice(0, 5).map((c) => (
                    <div key={c.id} className={`flex items-center justify-between p-3 rounded-lg ${!c.read ? 'bg-primary/5 border border-primary/20' : 'bg-muted'}`}>
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.service || 'Sem serviço'}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum contato recebido ainda.</p>
              )}
            </div>

            {/* Recent posts */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl">Posts Recentes</h2>
                <Link to="/admin/posts" className="text-sm text-primary hover:underline">Ver todos</Link>
              </div>
              {posts && posts.length > 0 ? (
                <div className="space-y-3">
                  {posts.slice(0, 5).map((p) => (
                    <Link key={p.id} to={`/admin/posts/edit/${p.id}`} className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                      <div>
                        <p className="text-sm font-medium">{p.title}</p>
                        <span className={`text-xs ${p.published ? 'text-green-400' : 'text-muted-foreground'}`}>
                          {p.published ? 'Publicado' : 'Rascunho'}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(p.created_at!).toLocaleDateString('pt-BR')}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum post criado ainda.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
