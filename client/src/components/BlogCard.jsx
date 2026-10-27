import { Link } from 'react-router-dom';
import { FiClock, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function BlogCard({ post, featured = false }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="group h-full">
      <Link
        to={`/blog/${post.slug}`}
        className={`flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card ${
          featured ? 'lg:flex-row' : ''
        }`}
      >
        <div className={`aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 ${featured ? 'lg:w-1/2 lg:aspect-auto' : ''}`}>
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full grid place-items-center font-display text-xl text-muted px-6 text-center">
              {post.title}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-6">
          <span className="text-[11px] font-mono uppercase tracking-widest text-secondary">
            {post.category}
          </span>
          <h3 className={`font-display font-semibold mt-2 group-hover:text-secondary transition-colors ${featured ? 'text-2xl' : 'text-lg'}`}>
            {post.title}
          </h3>
          <p className="text-sm text-muted mt-2 leading-relaxed flex-1 line-clamp-3">
            {post.description}
          </p>
          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <FiCalendar size={12} /> {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock size={12} /> {post.readingTime} min read
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
