import { useEffect, useState } from 'react';
import { FiFolder, FiBarChart2, FiMail, FiFileText, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import { AdminPageHeader } from '../../components/admin/AdminUI';

const STAT_CARDS = [
  { key: 'projects', label: 'Total Projects', icon: FiFolder },
  { key: 'skills', label: 'Total Skills', icon: FiBarChart2 },
  { key: 'unreadMessages', label: 'Unread Messages', icon: FiMail },
  { key: 'blogPosts', label: 'Blog Posts', icon: FiFileText },
  { key: 'visitors', label: 'Visitors', icon: FiUsers },
];

export default function Overview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard/stats')
      .then((res) => setData(res.data))
      .catch(() => setError('Could not load dashboard stats.'));
  }, []);

  if (error) return <p className="text-red-400 text-sm">{error}</p>;
  if (!data) return <Loader />;

  return (
    <div>
      <AdminPageHeader title="Overview" description="A snapshot of your portfolio content." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {STAT_CARDS.map(({ key, label, icon: Icon }) => (
          <div key={key} className="rounded-2xl border border-border bg-card p-5">
            <span className="w-9 h-9 grid place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-secondary mb-3">
              <Icon size={16} />
            </span>
            <p className="text-2xl font-display font-semibold">{data.totals[key]}</p>
            <p className="text-xs text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold">Recent Messages</h2>
            <Link to="/admin/messages" className="text-xs text-secondary hover:underline">View all</Link>
          </div>
          {data.recentMessages.length === 0 ? (
            <p className="text-sm text-muted">No messages yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.recentMessages.map((m) => (
                <li key={m._id} className="flex items-start justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{m.subject}</p>
                    <p className="text-muted truncate">{m.name} · {m.email}</p>
                  </div>
                  {!m.read && <span className="shrink-0 w-2 h-2 rounded-full bg-secondary mt-1.5" />}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold">Recent Projects</h2>
            <Link to="/admin/projects" className="text-xs text-secondary hover:underline">View all</Link>
          </div>
          {data.recentProjects.length === 0 ? (
            <p className="text-sm text-muted">No projects yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.recentProjects.map((p) => (
                <li key={p._id} className="flex items-center justify-between gap-3 text-sm">
                  <p className="font-medium truncate">{p.title}</p>
                  <span className="text-xs text-muted shrink-0">{p.category}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
