import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiClock, FiCalendar, FiArrowLeft, FiTag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Reveal from '../components/Reveal';
import BlogCard from '../components/BlogCard';
import Loader from '../components/Loader';
import NotFound from './NotFound';
import { useStructuredData } from '../hooks/useStructuredData';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/blog/${slug}`)
      .then((res) => {
        setPost(res.data.post);
        setRelated(res.data.related);
        document.title = `${res.data.post.title} — Salman Raza`;
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    window.scrollTo(0, 0);
  }, [slug]);

  useStructuredData(
    post && {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.metaDescription || post.description,
      image: post.thumbnail || undefined,
      author: { '@type': 'Person', name: post.author },
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      keywords: post.tags?.join(', '),
    }
  );

  if (loading) return <Loader />;
  if (notFound || !post) return <NotFound />;

  return (
    <article className="pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <Link to="/blog" className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors mb-8">
            <FiArrowLeft size={14} /> Back to blog
          </Link>

          <span className="font-mono text-xs tracking-widest text-secondary uppercase">
            {post.category}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mt-3 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 mt-6 text-sm text-muted">
            <span>{post.author}</span>
            <span className="flex items-center gap-1.5">
              <FiCalendar size={13} /> {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock size={13} /> {post.readingTime} min read
            </span>
          </div>
        </Reveal>

        {post.thumbnail && (
          <Reveal delay={0.1}>
            <div className="aspect-video rounded-2xl overflow-hidden border border-border my-10">
              <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </Reveal>
        )}

        <Reveal delay={0.15}>
          <div className="prose-blog prose prose-invert max-w-none mt-10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </Reveal>

        {post.tags?.length > 0 && (
          <Reveal delay={0.2} className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-border">
            <FiTag size={14} className="text-muted" />
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded-md bg-border/60 text-muted">
                {tag}
              </span>
            ))}
          </Reveal>
        )}

        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 pt-10 border-t border-border"
          >
            <h2 className="font-display text-xl font-semibold mb-6">Related articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <BlogCard key={p._id} post={p} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </article>
  );
}
