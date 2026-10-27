import { useEffect, useState } from 'react';
import { FiTrash2, FiMail, FiSearch } from 'react-icons/fi';
import { HiOutlineEnvelopeOpen } from 'react-icons/hi2';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { AdminPageHeader } from '../../components/admin/AdminUI';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const load = (query = '') => {
    setLoading(true);
    api
      .get('/messages', { params: query ? { search: query } : {} })
      .then((res) => setMessages(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  useEffect(() => {
    const t = setTimeout(() => load(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const openMessage = async (message) => {
    setExpanded(expanded === message._id ? null : message._id);
    if (!message.read) {
      await api.patch(`/messages/${message._id}/read`);
      setMessages((prev) => prev.map((m) => (m._id === message._id ? { ...m, read: true } : m)));
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/messages/${deleteTarget._id}`);
      setMessages((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Messages" description="Contact form submissions from your site." />

      <div className="relative mb-6 max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={15} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or subject"
          className="w-full rounded-lg border border-border bg-card pl-9 pr-3.5 py-2.5 text-sm focus:border-secondary outline-none transition-colors"
        />
      </div>

      {loading ? (
        <Loader />
      ) : messages.length === 0 ? (
        <p className="text-sm text-muted">No messages found.</p>
      ) : (
        <div className="rounded-2xl border border-border bg-card divide-y divide-border">
          {messages.map((message) => (
            <div key={message._id}>
              <button
                onClick={() => openMessage(message)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-border/20 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {message.read ? (
                    <HiOutlineEnvelopeOpen size={16} className="text-muted shrink-0" />
                  ) : (
                    <FiMail size={16} className="text-secondary shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${message.read ? 'text-muted' : 'font-medium'}`}>
                      {message.subject}
                    </p>
                    <p className="text-xs text-muted truncate">{message.name} · {message.email}</p>
                  </div>
                </div>
                <span className="text-xs text-muted shrink-0">
                  {new Date(message.createdAt).toLocaleDateString()}
                </span>
              </button>

              {expanded === message._id && (
                <div className="px-5 pb-5 -mt-2">
                  <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap border-t border-border pt-4">
                    {message.message}
                  </p>
                  <button
                    onClick={() => setDeleteTarget(message)}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 mt-4 transition-colors"
                  >
                    <FiTrash2 size={13} /> Delete message
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        confirming={deleting}
        title="Delete message?"
        message={`This permanently removes the message from "${deleteTarget?.name}".`}
      />
    </div>
  );
}
