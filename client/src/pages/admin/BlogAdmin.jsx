import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUploadCloud, FiExternalLink } from 'react-icons/fi';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { AdminPageHeader, Field, TextInput, TextArea, PrimaryButton } from '../../components/admin/AdminUI';

const emptyForm = {
  title: '', slug: '', description: '', content: '', thumbnail: '',
  tags: '', category: '', author: 'Salman Raza', status: 'draft', metaDescription: '',
};

function StatusBadge({ status }) {
  return (
    <span
      className={`text-[11px] px-2 py-0.5 rounded-full ${
        status === 'published' ? 'bg-green-400/15 text-green-400' : 'bg-border text-muted'
      }`}
    >
      {status === 'published' ? 'Published' : 'Draft'}
    </span>
  );
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = (query = search, status = statusFilter) => {
    setLoading(true);
    api
      .get('/blog/admin/all', { params: { search: query || undefined, status } })
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);
  useEffect(() => {
    const t = setTimeout(() => load(search, statusFilter), 300);
    return () => clearTimeout(t);
  }, [search, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = async (post) => {
    setError('');
    const res = await api.get(`/blog/admin/${post._id}`);
    const full = res.data;
    setEditing(full);
    setForm({
      title: full.title,
      slug: full.slug,
      description: full.description,
      content: full.content,
      thumbnail: full.thumbnail || '',
      tags: (full.tags || []).join(', '),
      category: full.category,
      author: full.author || 'Salman Raza',
      status: full.status,
      metaDescription: full.metaDescription || '',
    });
    setModalOpen(true);
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/upload/image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((f) => ({ ...f, thumbnail: res.data.url }));
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editing) await api.put(`/blog/${editing._id}`, payload);
      else await api.post('/blog', payload);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/blog/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Blog"
        description="Write and manage posts for the public blog."
        action={
          <PrimaryButton onClick={openCreate} className="flex items-center gap-2">
            <FiPlus size={16} /> New Post
          </PrimaryButton>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category"
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3.5 py-2.5 text-sm focus:border-secondary outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'published', 'draft'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border capitalize transition-all ${
                statusFilter === s
                  ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent'
                  : 'border-border text-muted hover:text-text hover:border-secondary/50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted">No posts yet — write your first one.</p>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Views</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium max-w-[240px] truncate">{post.title}</td>
                  <td className="px-5 py-3 text-muted">{post.category}</td>
                  <td className="px-5 py-3"><StatusBadge status={post.status} /></td>
                  <td className="px-5 py-3 text-muted">{post.views}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3 text-muted">
                      {post.status === 'published' && (
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="View live"
                          className="hover:text-secondary transition-colors"
                        >
                          <FiExternalLink size={15} />
                        </a>
                      )}
                      <button onClick={() => openEdit(post)} aria-label="Edit" className="hover:text-text transition-colors">
                        <FiEdit2 size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(post)} aria-label="Delete" className="hover:text-red-400 transition-colors">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Post' : 'New Post'}>
        <form onSubmit={handleSubmit}>
          <Field label="Title">
            <TextInput required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </Field>
          <Field label="Slug (leave blank to auto-generate from title)">
            <TextInput value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="my-post-title" />
          </Field>
          <Field label="Description (shown on cards, max 300 chars)">
            <TextArea required rows={2} maxLength={300} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </Field>
          <Field label="Content (Markdown supported)">
            <TextArea required rows={10} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="font-mono text-xs" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <TextInput required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Backend, Frontend..." />
            </Field>
            <Field label="Author">
              <TextInput value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
            </Field>
          </div>
          <Field label="Tags (comma separated)">
            <TextInput value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="Node.js, Auth, Deployment" />
          </Field>
          <Field label="Thumbnail">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-border text-sm cursor-pointer hover:border-secondary transition-colors">
                <FiUploadCloud size={15} />
                {uploading ? 'Uploading...' : 'Upload'}
                <input type="file" accept="image/*" hidden onChange={handleThumbnailUpload} />
              </label>
              {form.thumbnail && <span className="text-xs text-muted truncate">{form.thumbnail}</span>}
            </div>
          </Field>
          <Field label="Meta description (SEO, optional — defaults to description)">
            <TextInput maxLength={160} value={form.metaDescription} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))} />
          </Field>
          <Field label="Status">
            <div className="flex gap-2">
              {['draft', 'published'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize border transition-all ${
                    form.status === s
                      ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent'
                      : 'border-border text-muted hover:text-text'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium border border-border text-muted hover:text-text transition-colors">
              Cancel
            </button>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Post'}
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        confirming={deleting}
        title="Delete post?"
        message={`This permanently removes "${deleteTarget?.title}" from your blog.`}
      />
    </div>
  );
}
