import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { supabase, BlogPost } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

export default function BlogPreviewSection() {
  const { ref, controls, variants } = useScrollReveal();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setPosts(data);
      });
  }, []);

  return (
    <section id="blog" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={variants}>
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Blog</p>
            <h2 className="text-4xl md:text-5xl font-heading">
              Conteúdo para <span className="text-gradient">você</span>
            </h2>
          </div>

          {posts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/blog/${post.slug}`} className="group block">
                    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {post.cover_image ? (
                          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground font-heading text-3xl">EDGAR</div>
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
          ) : (
            <div className="text-center text-muted-foreground mb-12">
              <p>Artigos em breve. Fique ligado!</p>
            </div>
          )}

          <div className="text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-md font-semibold hover:border-primary hover:text-primary transition-all"
            >
              Ver todos os artigos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
