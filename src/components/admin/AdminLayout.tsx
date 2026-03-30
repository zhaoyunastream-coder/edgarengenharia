import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { LayoutDashboard, FileText, PenSquare, Mail, BarChart2, LogOut, Menu, X, Loader2 } from 'lucide-react';
import { useState } from 'react';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Posts', href: '/admin/posts', icon: FileText },
  { label: 'Novo Post', href: '/admin/posts/new', icon: PenSquare },
  { label: 'Contatos', href: '/admin/contatos', icon: Mail },
];

export default function AdminLayout() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin" replace />;

  const SidebarContent = () => (
    <nav className="flex flex-col gap-1 p-4">
      <div className="flex items-center gap-1 mb-8 px-2">
        <span className="font-heading text-2xl text-primary">EDGAR</span>
        <span className="font-heading text-2xl text-foreground">Admin</span>
      </div>
      {sidebarLinks.map((link) => {
        const isActive = location.pathname === link.href || (link.href !== '/admin/dashboard' && location.pathname.startsWith(link.href) && link.href !== '/admin/posts/new');
        return (
          <Link
            key={link.href}
            to={link.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <link.icon className="w-4 h-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 border-r border-border flex-col bg-card shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed top-0 left-0 bottom-0 w-60 bg-card border-r border-border z-50 md:hidden">
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileOpen(false)} className="text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden text-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-muted-foreground">
              Painel Admin — <span className="text-foreground">Engenheiro Edgar</span>
            </span>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
