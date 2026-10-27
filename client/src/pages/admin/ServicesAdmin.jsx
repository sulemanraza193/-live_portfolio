import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { AdminPageHeader, Field, TextInput, TextArea, PrimaryButton } from '../../components/admin/AdminUI';

const emptyForm = { title: '', description: '', icon: '' };

export default function ServicesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/services').then((res) => setItems(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description, icon: item.icon || '' });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) await api.put(`/services/${editing._id}`, form);
      else await api.post('/services', form);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/services/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description="Service cards shown on the public site."
        action={
          <PrimaryButton onClick={openCreate} className="flex items-center gap-2">
            <FiPlus size={16} /> Add Service
          </PrimaryButton>
        }
      />

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <p className="text-sm text-muted">No services yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <h3 className="font-display font-semibold">{item.title}</h3>
                <div className="flex items-center gap-3 text-muted shrink-0">
                  <button onClick={() => openEdit(item)} aria-label="Edit" className="hover:text-text transition-colors">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(item)} aria-label="Delete" className="hover:text-red-400 transition-colors">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted mt-2 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Service' : 'Add Service'}>
        <form onSubmit={handleSubmit}>
          <Field label="Title">
            <TextInput required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </Field>
          <Field label="Description">
            <TextArea required rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </Field>
          <Field label="Icon name (react-icons, optional)">
            <TextInput value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} placeholder="FiLayout, FiServer..." />
          </Field>

          {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium border border-border text-muted hover:text-text transition-colors">
              Cancel
            </button>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Service'}
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        confirming={deleting}
        title="Delete service?"
        message={`This removes "${deleteTarget?.title}" from your services list.`}
      />
    </div>
  );
}
