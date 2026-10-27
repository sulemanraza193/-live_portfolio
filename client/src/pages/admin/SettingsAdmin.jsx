import { useAuth } from '../../context/AuthContext';
import { AdminPageHeader } from '../../components/admin/AdminUI';

export default function SettingsAdmin() {
  const { user } = useAuth();

  return (
    <div>
      <AdminPageHeader title="Settings" description="Your admin account details." />

      <div className="rounded-2xl border border-border bg-card p-6 max-w-md space-y-4">
        <div>
          <p className="text-xs text-muted">Username</p>
          <p className="text-sm font-medium">{user?.username}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Email</p>
          <p className="text-sm font-medium">{user?.email}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Role</p>
          <p className="text-sm font-medium capitalize">{user?.role}</p>
        </div>
      </div>

      <p className="text-xs text-muted mt-6 max-w-md">
        Password changes and other account settings aren't wired up yet — for now, update
        credentials directly via the <code className="text-secondary">seed:admin</code> script
        or database.
      </p>
    </div>
  );
}
