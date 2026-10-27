import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiFolder, FiBarChart2, FiClock, FiLayers,
  FiFileText, FiMail, FiFile, FiSettings, FiLogOut, FiX, FiMenu,
} from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Overview', to: '/admin', icon: FiGrid, end: true },
  { label: 'Projects', to: '/admin/projects', icon: FiFolder },
  { label: 'Skills', to: '/admin/skills', icon: FiBarChart2 },
  { label: 'Experience', to: '/admin/experience', icon: FiClock },
  { label: 'Services', to: '/admin/services', icon: FiLayers },
  { label: 'Blog', to: '/admin/blog', icon: FiFileText },
  { label: 'Messages', to: '/admin/messages', icon: FiMail },
  { label: 'Resume', to: '/admin/resume', icon: FiFile },
  { label: 'Settings', to: '/admin/settings', icon: FiSettings },
];

function SidebarLinks({ onNavigate }) {
  return (
    <nav className="flex-1 px-3 space-y-1">
      {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-text border border-secondary/30'
                : 'text-muted hover:text-text hover:bg-border/40'
            }`
          }
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <>
      <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-border">
        <a href="/admin" className="font-display font-semibold">
          <span className="gradient-text">Admin</span>
        </a>
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="text-text">
          <FiMenu size={22} />
        </button>
      </div>

      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border h-screen sticky top-0 py-6">
        <a href="/admin" className="px-6 mb-8 font-display text-lg font-semibold">
          <span className="gradient-text">Salman</span>
          <span className="text-muted">.dev</span>
          <p className="text-xs text-muted font-normal mt-0.5">Admin Dashboard</p>
        </a>

        <SidebarLinks />

        <div className="px-3 mt-6 pt-6 border-t border-border">
          <div className="px-3 mb-3">
            <p className="text-sm font-medium truncate">{user?.username}</p>
            <p className="text-xs text-muted truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-bg border-r border-border z-50 flex flex-col py-6 lg:hidden"
            >
              <div className="flex items-center justify-between px-6 mb-8">
                <span className="font-display text-lg font-semibold">
                  <span className="gradient-text">Salman</span>
                  <span className="text-muted">.dev</span>
                </span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <FiX size={20} />
                </button>
              </div>

              <SidebarLinks onNavigate={() => setMobileOpen(false)} />

              <div className="px-3 mt-6 pt-6 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <FiLogOut size={16} /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
