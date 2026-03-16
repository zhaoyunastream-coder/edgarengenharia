import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, BlogPost } from '@/lib/supabase';
import { Search, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (category) query = query.eq('category', category);
      if (search) query = query.ilike('title', `%${search}%`);

      const { data } = await query;
      setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, [search, category]);

  const categories = ['BIM', 'Regularização', 'INSS', 'Estruturas', 'Dicas'];
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Blog</p>
            <h1 className="text-4xl md:text-6xl font-heading">
              Artigos e <span className="text-gradient">Conteúdo</span>
            </h1>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar artigos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-card border border-border rounded-md pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <button
              onClick={() => setCategory('')}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${!category ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:border-primary'}`}
            >
              Todos
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all ${category === c ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:border-primary'}`}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground py-20">Carregando...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-muted-foreground py-20">
              <p className="text-lg">Nenhum artigo encontrado.</p>
              <p className="text-sm mt-2">Novos conteúdos em breve!</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <Link to={`/blog/${featured.slug}`} className="group block mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-lg overflow-hidden grid md:grid-cols-2 hover:border-primary/50 transition-all"
                  >
                    <div className="aspect-video md:aspect-auto bg-muted relative overflow-hidden">
                      {featured.cover_image ? (
                        <img src={featured.cover_image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-heading text-5xl text-muted-foreground/20">EDGAR</div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      {featured.category && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded self-start mb-4">{featured.category}</span>
                      )}
                      <h2 className="font-heading text-3xl mb-3 group-hover:text-primary transition-colors">{featured.title}</h2>
                      {featured.excerpt && <p className="text-muted-foreground mb-4">{featured.excerpt}</p>}
                      <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                        Ler mais <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {rest.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={`/blog/${post.slug}`} className="group block">
                      <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          {post.cover_image ? (
                            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-heading text-3xl text-muted-foreground/20">EDGAR</div>
                          )}
                          {post.category && (
                            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{post.category}</span>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-heading text-xl mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                          {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {post.published_at ? new Date(post.published_at).toLocaleDateString('pt-BR') : ''}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
