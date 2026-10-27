import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { AdminPageHeader, Field, TextInput, TextArea, PrimaryButton } from '../../components/admin/AdminUI';

const emptyForm = { company: '', position: '', duration: '', description: '' };

export default function ExperienceAdmin() {
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
    api.get('/experience').then((res) => setItems(res.data)).finally(() => setLoading(false));
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
    setForm({
      company: item.company, position: item.position,
      duration: item.duration, description: item.description,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) await api.put(`/experience/${editing._id}`, form);
      else await api.post('/experience', form);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/experience/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Experience"
        description="Timeline entries shown on the public site."
        action={
          <PrimaryButton onClick={openCreate} className="flex items-center gap-2">
            <FiPlus size={16} /> Add Entry
          </PrimaryButton>
        }
      />

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <p className="text-sm text-muted">No experience entries yet.</p>
      ) : (
        <div className="rounded-2xl border border-border bg-card divide-y divide-border">
          {items.map((item) => (
            <div key={item._id} className="flex items-start justify-between gap-4 p-5">
              <div>
                <p className="text-xs font-mono text-secondary">{item.duration}</p>
                <p className="font-medium mt-1">{item.position}</p>
                <p className="text-sm text-muted">{item.company}</p>
                <p className="text-sm text-muted mt-2 leading-relaxed max-w-2xl">{item.description}</p>
              </div>
              <div className="flex items-center gap-3 text-muted shrink-0">
                <button onClick={() => openEdit(item)} aria-label="Edit" className="hover:text-text transition-colors">
                  <FiEdit2 size={15} />
                </button>
                <button onClick={() => setDeleteTarget(item)} aria-label="Delete" className="hover:text-red-400 transition-colors">
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Entry' : 'Add Entry'}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Company">
              <TextInput required value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
            </Field>
            <Field label="Position">
              <TextInput required value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} />
            </Field>
          </div>
          <Field label="Duration">
            <TextInput required value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="2024 — Present" />
          </Field>
          <Field label="Description">
            <TextArea required rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </Field>

          {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium border border-border text-muted hover:text-text transition-colors">
              Cancel
            </button>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Entry'}
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        confirming={deleting}
        title="Delete entry?"
        message={`This removes "${deleteTarget?.position} at ${deleteTarget?.company}" from your timeline.`}
      />
    </div>
  );
}
