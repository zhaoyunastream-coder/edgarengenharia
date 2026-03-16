import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPosts() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const perPage = 10;
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts', search, page],
    queryFn: async () => {
      let query = supabase.from('blog_posts').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(page * perPage, (page + 1) * perPage - 1);
      if (search) query = query.ilike('title', `%${search}%`);
      const { data, count } = await query;
      return { posts: data ?? [], total: count ?? 0 };
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const updates: Record<string, unknown> = { published: !published, updated_at: new Date().toISOString() };
      if (!published) updates.published_at = new Date().toISOString();
      await supabase.from('blog_posts').update(updates).eq('id', id);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-posts'] }); toast({ title: 'Status atualizado!' }); },
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('blog_posts').delete().eq('id', id);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-posts'] }); toast({ title: 'Post deletado!' }); },
  });

  const totalPages = Math.ceil((posts?.total ?? 0) / perPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-heading text-3xl">Posts do Blog</h1>
        <Link to="/admin/posts/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:brightness-110 transition-all">
          <Plus className="w-4 h-4" /> Novo Post
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : posts && posts.posts.length > 0 ? (
        <>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Título</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Categoria</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">Data</th>
                    <th className="text-right px-4 py-3 text-muted-foreground font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.posts.map((post) => (
                    <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium max-w-xs truncate">{post.title}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{post.category || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${post.published ? 'bg-green-500/10 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                          {post.published ? 'Publicado' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{new Date(post.created_at!).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/admin/posts/edit/${post.id}`} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground" title="Editar">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => togglePublish.mutate({ id: post.id, published: !!post.published })} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground" title={post.published ? 'Despublicar' : 'Publicar'}>
                            {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button onClick={() => { if (confirm('Tem certeza que deseja deletar este post?')) deletePost.mutate(post.id); }} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive" title="Deletar">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors">Anterior</button>
              <span className="text-sm text-muted-foreground">Página {page + 1} de {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors">Próxima</button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{search ? 'Nenhum post encontrado.' : 'Nenhum post criado ainda.'}</p>
          {!search && (
            <Link to="/admin/posts/new" className="inline-flex items-center gap-2 mt-4 text-primary hover:underline text-sm">
              <Plus className="w-4 h-4" /> Criar primeiro post
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// Need FileText import for empty state
import { FileText as _ft } from 'lucide-react';
