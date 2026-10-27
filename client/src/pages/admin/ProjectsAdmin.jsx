import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiEye, FiEyeOff, FiUploadCloud } from 'react-icons/fi';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { AdminPageHeader, Field, TextInput, TextArea, PrimaryButton } from '../../components/admin/AdminUI';

const emptyForm = {
  title: '', description: '', image: '', github: '', live: '',
  techStack: '', category: '', featured: false,
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/projects').then((res) => setProjects(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      image: project.image || '',
      github: project.github || '',
      live: project.live || '',
      techStack: (project.techStack || []).join(', '),
      category: project.category,
      featured: project.featured,
    });
    setError('');
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
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
      setForm((f) => ({ ...f, image: res.data.url }));
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
      techStack: form.techStack.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await api.put(`/projects/${editing._id}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const toggleField = async (project, field) => {
    await api.put(`/projects/${project._id}`, { ...project, [field]: !project[field] });
    load();
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/projects/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Manage the projects shown on your public site."
        action={
          <PrimaryButton onClick={openCreate} className="flex items-center gap-2">
            <FiPlus size={16} /> Add Project
          </PrimaryButton>
        }
      />

      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <p className="text-sm text-muted">No projects yet — add your first one.</p>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium">{project.title}</td>
                  <td className="px-5 py-3 text-muted">{project.category}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {project.featured && (
                        <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">
                          <FiStar size={10} /> Featured
                        </span>
                      )}
                      {project.hidden && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-border text-muted">Hidden</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3 text-muted">
                      <button onClick={() => toggleField(project, 'featured')} aria-label="Toggle featured" className="hover:text-secondary transition-colors">
                        <FiStar size={15} />
                      </button>
                      <button onClick={() => toggleField(project, 'hidden')} aria-label="Toggle visibility" className="hover:text-secondary transition-colors">
                        {project.hidden ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      </button>
                      <button onClick={() => openEdit(project)} aria-label="Edit" className="hover:text-text transition-colors">
                        <FiEdit2 size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(project)} aria-label="Delete" className="hover:text-red-400 transition-colors">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'Add Project'}>
        <form onSubmit={handleSubmit}>
          <Field label="Title">
            <TextInput required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </Field>
          <Field label="Description">
            <TextArea required rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </Field>
          <Field label="Category">
            <TextInput required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Full Stack, Automation, etc." />
          </Field>
          <Field label="Tech Stack (comma separated)">
            <TextInput value={form.techStack} onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value }))} placeholder="React, Node.js, MongoDB" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="GitHub Link">
              <TextInput type="url" value={form.github} onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))} />
            </Field>
            <Field label="Live Link">
              <TextInput type="url" value={form.live} onChange={(e) => setForm((f) => ({ ...f, live: e.target.value }))} />
            </Field>
          </div>
          <Field label="Image">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-border text-sm cursor-pointer hover:border-secondary transition-colors">
                <FiUploadCloud size={15} />
                {uploading ? 'Uploading...' : 'Upload'}
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </label>
              {form.image && <span className="text-xs text-muted truncate">{form.image}</span>}
            </div>
          </Field>
          <label className="flex items-center gap-2 text-sm mb-5">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="accent-secondary"
            />
            Featured project
          </label>

          {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium border border-border text-muted hover:text-text transition-colors">
              Cancel
            </button>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Project'}
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        confirming={deleting}
        title="Delete project?"
        message={`This permanently removes "${deleteTarget?.title}" from your portfolio.`}
      />
    </div>
  );
}
