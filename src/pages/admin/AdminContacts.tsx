import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Download, Mail, MailOpen, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminContacts() {
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const perPage = 20;
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-contacts', search, serviceFilter, page],
    queryFn: async () => {
      let query = supabase.from('contact_submissions').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(page * perPage, (page + 1) * perPage - 1);
      if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      if (serviceFilter) query = query.eq('service', serviceFilter);
      const { data, count } = await query;
      return { contacts: data ?? [], total: count ?? 0 };
    },
  });

  const { data: allContacts } = useQuery({
    queryKey: ['admin-contacts-services'],
    queryFn: async () => {
      const { data } = await supabase.from('contact_submissions').select('service');
      return [...new Set((data ?? []).map((d) => d.service).filter(Boolean))] as string[];
    },
  });

  const toggleRead = useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
      await supabase.from('contact_submissions').update({ read: !read }).eq('id', id);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-contacts'] }); },
  });

  const exportCSV = () => {
    if (!data?.contacts.length) return;
    const headers = ['Nome', 'E-mail', 'Telefone', 'Serviço', 'Mensagem', 'Data'];
    const rows = data.contacts.map((c) => [
      c.name, c.email, c.phone || '', c.service || '', (c.message || '').replace(/"/g, '""'), new Date(c.created_at).toLocaleDateString('pt-BR'),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contatos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'CSV exportado!' });
  };

  const totalPages = Math.ceil((data?.total ?? 0) / perPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-heading text-3xl">Contatos</h1>
        <button onClick={exportCSV} className="border border-border text-foreground px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:border-primary hover:text-primary transition-all">
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        {allContacts && allContacts.length > 0 && (
          <select
            value={serviceFilter}
            onChange={(e) => { setServiceFilter(e.target.value); setPage(0); }}
            className="bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">Todos os serviços</option>
            {allContacts.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : data && data.contacts.length > 0 ? (
        <>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Nome</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">E-mail</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Telefone</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">Serviço</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">Data</th>
                    <th className="text-right px-4 py-3 text-muted-foreground font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.contacts.map((c) => (
                    <>
                      <tr
                        key={c.id}
                        onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                        className={`border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${!c.read ? 'bg-primary/5' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {!c.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                            <span className={`font-medium ${!c.read ? 'text-foreground' : 'text-muted-foreground'}`}>{c.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{c.email}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{c.phone || '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{c.service || '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleRead.mutate({ id: c.id, read: c.read }); }}
                              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                              title={c.read ? 'Marcar como não lido' : 'Marcar como lido'}
                            >
                              {c.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                            </button>
                            {expandedId === c.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                          </div>
                        </td>
                      </tr>
                      {expandedId === c.id && (
                        <tr key={`${c.id}-expand`} className="border-b border-border">
                          <td colSpan={6} className="px-4 py-4">
                            <div className="bg-muted rounded-lg p-4 space-y-2">
                              <div className="grid grid-cols-2 gap-2 text-sm md:hidden">
                                <div><span className="text-muted-foreground">E-mail:</span> {c.email}</div>
                                <div><span className="text-muted-foreground">Telefone:</span> {c.phone || '—'}</div>
                                <div><span className="text-muted-foreground">Serviço:</span> {c.service || '—'}</div>
                              </div>
                              <p className="text-sm font-medium text-muted-foreground">Mensagem:</p>
                              <p className="text-sm text-foreground whitespace-pre-wrap">{c.message || 'Sem mensagem.'}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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
          <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum contato recebido ainda.</p>
        </div>
      )}
    </div>
  );
}
