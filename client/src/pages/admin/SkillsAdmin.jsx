import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { AdminPageHeader, Field, TextInput, PrimaryButton } from '../../components/admin/AdminUI';

const emptyForm = { category: '', name: '', icon: '', percentage: 80, color: '#4F46E5' };

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([]);
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
    api.get('/skills').then((res) => setSkills(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (skill) => {
    setEditing(skill);
    setForm({
      category: skill.category, name: skill.name, icon: skill.icon || '',
      percentage: skill.percentage, color: skill.color || '#4F46E5',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, percentage: Number(form.percentage) };
      if (editing) await api.put(`/skills/${editing._id}`, payload);
      else await api.post('/skills', payload);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save skill');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/skills/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const grouped = skills.reduce((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div>
      <AdminPageHeader
        title="Skills"
        description="Grouped by category, shown as animated progress bars on the public site."
        action={
          <PrimaryButton onClick={openCreate} className="flex items-center gap-2">
            <FiPlus size={16} /> Add Skill
          </PrimaryButton>
        }
      />

      {loading ? (
        <Loader />
      ) : skills.length === 0 ? (
        <p className="text-sm text-muted">No skills yet — add your first one.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold mb-4">{category}</h3>
              <ul className="divide-y divide-border">
                {items.map((skill) => (
                  <li key={skill._id} className="flex items-center justify-between py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: skill.color }} />
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted">{skill.percentage}%</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted">
                      <button onClick={() => openEdit(skill)} aria-label="Edit" className="hover:text-text transition-colors">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(skill)} aria-label="Delete" className="hover:text-red-400 transition-colors">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Skill' : 'Add Skill'}>
        <form onSubmit={handleSubmit}>
          <Field label="Category">
            <TextInput required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Frontend, Backend, Database..." />
          </Field>
          <Field label="Skill Name">
            <TextInput required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Percentage">
              <TextInput type="number" min="0" max="100" required value={form.percentage} onChange={(e) => setForm((f) => ({ ...f, percentage: e.target.value }))} />
            </Field>
            <Field label="Color">
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                className="w-full h-[42px] rounded-lg border border-border bg-bg cursor-pointer"
              />
            </Field>
          </div>
          <Field label="Icon name (react-icons, optional)">
            <TextInput value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} placeholder="FaReact, SiMongodb..." />
          </Field>

          {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium border border-border text-muted hover:text-text transition-colors">
              Cancel
            </button>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Skill'}
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        confirming={deleting}
        title="Delete skill?"
        message={`This removes "${deleteTarget?.name}" from your skills list.`}
      />
    </div>
  );
}
