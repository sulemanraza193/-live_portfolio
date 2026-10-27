import { useEffect, useState } from 'react';
import { FiUploadCloud, FiFile, FiTrash2, FiDownload } from 'react-icons/fi';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { AdminPageHeader } from '../../components/admin/AdminUI';

export default function ResumeAdmin() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/resume')
      .then((res) => setResume(res.data))
      .catch(() => setResume(null))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('resume', file);
      const res = await api.post('/resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResume(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete('/resume');
      setResume(null);
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <AdminPageHeader
        title="Resume"
        description="Upload the PDF shown by the Download Resume buttons on your site."
      />

      <div className="rounded-2xl border border-border bg-card p-6 max-w-lg">
        {resume ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-10 h-10 grid place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-secondary shrink-0">
                <FiFile size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{resume.originalName}</p>
                <p className="text-xs text-muted">
                  Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted shrink-0">
              <a href={resume.url} download target="_blank" rel="noreferrer" aria-label="Download" className="hover:text-text transition-colors">
                <FiDownload size={16} />
              </a>
              <button onClick={() => setConfirmOpen(true)} aria-label="Delete" className="hover:text-red-400 transition-colors">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted mb-4">No resume uploaded yet.</p>
        )}

        <label className="flex items-center justify-center gap-2 mt-5 px-4 py-3 rounded-lg border border-dashed border-border text-sm text-muted hover:border-secondary hover:text-text cursor-pointer transition-colors">
          <FiUploadCloud size={16} />
          {uploading ? 'Uploading...' : resume ? 'Replace resume' : 'Upload resume (PDF)'}
          <input type="file" accept="application/pdf" hidden onChange={handleUpload} disabled={uploading} />
        </label>
        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        confirming={deleting}
        title="Delete resume?"
        message="Visitors won't be able to download a resume until you upload a new one."
      />
    </div>
  );
}
