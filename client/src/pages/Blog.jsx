import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Reveal from '../components/Reveal';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

export default function Blog() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get('/blog/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 6, featured: page === 1 && !search && category === 'All' };
    if (category !== 'All') params.category = category;
    if (search) params.search = search;

    api
      .get('/blog', { params })
      .then((res) => setData(res.data))
      .catch(() => setData({ posts: [], featuredPost: null, pagination: { page: 1, totalPages: 1 } }))
      .finally(() => setLoading(false));
  }, [page, category, search]);

  useEffect(() => setPage(1), [category, search]);

  const showFeatured = data?.featuredPost && page === 1 && !search && category === 'All';
  const listPosts = showFeatured
    ? data.posts.filter((p) => p._id !== data.featuredPost._id)
    : data?.posts || [];

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl mx-auto text-center mb-14">
          <span className="font-mono text-xs tracking-widest text-secondary uppercase">Blog</span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mt-3">
            Notes on building things
          </h1>
          <p className="text-muted mt-4 leading-relaxed">
            Write-ups on the MERN stack, automation, and whatever I'm learning at the moment.
          </p>
        </Reveal>

        <Reveal className="flex flex-col sm:flex-row items-center gap-4 justify-between mb-10">
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="w-full rounded-lg border border-border bg-card pl-9 pr-3.5 py-2.5 text-sm focus:border-secondary outline-none transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  category === cat
                    ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent'
                    : 'border-border text-muted hover:text-text hover:border-secondary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {loading ? (
          <Loader />
        ) : (data?.posts.length || 0) === 0 ? (
          <p className="text-center text-sm text-muted py-20">No posts found.</p>
        ) : (
          <motion.div layout>
            {showFeatured && (
              <Reveal className="mb-10">
                <BlogCard post={data.featuredPost} featured />
              </Reveal>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listPosts.map((post, i) => (
                <Reveal key={post._id} delay={i * 0.05}>
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>

            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onChange={setPage}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
