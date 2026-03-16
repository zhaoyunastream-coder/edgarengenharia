import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, BlogPost } from '@/lib/supabase';
import { ArrowLeft, Calendar, Share2, MessageCircle, Linkedin, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { toast } from '@/hooks/use-toast';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      setPost(data);

      if (data?.category) {
        const { data: rel } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .eq('category', data.category)
          .neq('slug', slug)
          .limit(3);
        setRelated(rel || []);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  const shareUrl = window.location.href;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({ title: 'Link copiado!' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 text-center text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl mb-4">Artigo não encontrado</h1>
          <Link to="/blog" className="text-primary hover:underline">Voltar ao blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Voltar ao blog
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {post.category && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded mb-4 inline-block">{post.category}</span>
            )}
            <h1 className="font-heading text-4xl md:text-6xl mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.published_at ? new Date(post.published_at).toLocaleDateString('pt-BR') : ''}</span>
              <span>Edgar Alexandre Kmiecik</span>
            </div>

            {post.cover_image && (
              <div className="aspect-video rounded-lg overflow-hidden mb-8 bg-card">
                <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-invert prose-amber max-w-none mb-12 
                [&_h2]:font-heading [&_h2]:text-3xl [&_h2]:mt-8 [&_h2]:mb-4
                [&_h3]:font-heading [&_h3]:text-2xl [&_h3]:mt-6 [&_h3]:mb-3
                [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4
                [&_ul]:text-muted-foreground [&_li]:mb-1
                [&_a]:text-primary [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            {/* Share */}
            <div className="border-t border-border pt-8 mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Compartilhar</span>
              </div>
              <div className="flex gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card border border-border rounded-md p-3 hover:border-primary transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card border border-border rounded-md p-3 hover:border-primary transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <button onClick={copyLink} className="bg-card border border-border rounded-md p-3 hover:border-primary transition-colors">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Author */}
            <div className="bg-card border border-border rounded-lg p-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center font-heading text-2xl text-primary">E</div>
                <div>
                  <h3 className="font-heading text-xl">Edgar Alexandre Kmiecik</h3>
                  <p className="text-sm text-muted-foreground">Engenheiro Civil — CREA-RS 243302</p>
                </div>
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h3 className="font-heading text-2xl mb-6">Artigos Relacionados</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {related.map((r) => (
                    <Link key={r.id} to={`/blog/${r.slug}`} className="group">
                      <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all">
                        <div className="aspect-video bg-muted flex items-center justify-center font-heading text-2xl text-muted-foreground/20">EAK</div>
                        <div className="p-4">
                          <h4 className="font-heading text-lg group-hover:text-primary transition-colors">{r.title}</h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </article>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
