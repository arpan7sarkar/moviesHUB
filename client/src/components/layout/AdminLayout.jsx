import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiGrid,
  FiFilm,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft,
  FiShield,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: FiGrid, end: true },
  { name: 'Movies', path: '/admin/movies', icon: FiFilm },
  { name: 'Users', path: '/admin/users', icon: FiUsers },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-primary flex pt-16 md:pt-[72px] transition-all duration-500 ease-in-out">
      {/* ───── Mobile Sidebar Overlay ───── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* ───── Sidebar ───── */}
      <aside
        className={`fixed top-16 md:top-[72px] left-0 bottom-0 z-[110] flex flex-col bg-secondary border-r border-border transition-all duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'md:w-[72px]' : 'md:w-60'} w-64`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0">
              <FiShield size={18} />
            </div>
            {(!collapsed || isMobileOpen) && (
              <div className="overflow-hidden min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">
                  Admin Panel
                </p>
                <p className="text-[11px] text-text-muted truncate">
                  {user?.name || 'Administrator'}
                </p>
              </div>
            )}
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="p-2 md:hidden text-text-muted hover:text-text-primary"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar scroll-smooth">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-accent/10 text-accent border border-accent/20 shadow-sm'
                    : 'text-text-secondary hover:bg-elevated hover:text-text-primary border border-transparent'
                }`
              }
            >
              <link.icon
                size={18}
                className="shrink-0 transition-colors"
              />
              {(!collapsed || isMobileOpen) && <span className="truncate">{link.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border px-3 py-3 space-y-2 shrink-0">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-elevated hover:text-text-primary transition-all group"
          >
            <FiArrowLeft size={18} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
            {(!collapsed || isMobileOpen) && <span>Back to Site</span>}
          </button>

          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="hidden md:flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs text-text-muted hover:bg-elevated hover:text-text-primary transition-all cursor-pointer"
          >
            {collapsed ? (
              <FiChevronRight size={16} className="shrink-0" />
            ) : (
              <>
                <FiChevronLeft size={16} className="shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ───── Main Content ───── */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out min-w-0 ${
          collapsed ? 'md:ml-[72px]' : 'md:ml-60'
        } ml-0`}
      >
        {/* Mobile Header Toggle */}
        <div className="sticky top-16 md:hidden px-4 md:px-0 z-30 transition-all duration-300">
          <div className="py-4 flex items-center gap-4">
             <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-lg bg-secondary border border-border text-text-primary shadow-sm active:scale-95 transition-all cursor-pointer"
              aria-label="Open sidebar"
            >
              <FiMenu size={20} />
            </button>
            <h1 className="text-lg font-bold text-text-primary uppercase tracking-wider font-display shrink-0">CineVault Admin</h1>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-[1400px] mx-auto w-full overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

