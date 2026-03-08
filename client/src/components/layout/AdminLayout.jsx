import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiGrid,
  FiFilm,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft,
  FiShield,
} from 'react-icons/fi';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: FiGrid, end: true },
  { name: 'Movies', path: '/admin/movies', icon: FiFilm },
  { name: 'Users', path: '/admin/users', icon: FiUsers },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary flex pt-16 md:pt-[72px]">
      {/* ───── Sidebar ───── */}
      <aside
        className={`fixed top-16 md:top-[72px] left-0 bottom-0 z-40 flex flex-col bg-secondary border-r border-border transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-60'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent flex-shrink-0">
            <FiShield size={18} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-text-primary truncate">
                Admin Panel
              </p>
              <p className="text-[11px] text-text-muted truncate">
                {user?.name || 'Administrator'}
              </p>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-text-secondary hover:bg-elevated hover:text-text-primary border border-transparent'
                }`
              }
            >
              <link.icon
                size={18}
                className="flex-shrink-0 transition-colors"
              />
              {!collapsed && <span className="truncate">{link.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border px-3 py-3 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-elevated hover:text-text-primary transition-all"
          >
            <FiArrowLeft size={18} className="flex-shrink-0" />
            {!collapsed && <span>Back to Site</span>}
          </button>

          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs text-text-muted hover:bg-elevated hover:text-text-primary transition-all"
          >
            {collapsed ? (
              <FiChevronRight size={16} className="flex-shrink-0" />
            ) : (
              <>
                <FiChevronLeft size={16} className="flex-shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ───── Main Content ───── */}
      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? 'ml-[72px]' : 'ml-60'
        }`}
      >
        <div className="p-6 md:p-8 lg:p-10 max-w-[1400px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

