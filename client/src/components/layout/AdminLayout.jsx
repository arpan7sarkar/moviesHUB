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
  FiSettings,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ui/ThemeToggle';

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
    <div className="min-h-screen bg-primary flex relative overflow-hidden">
      {/* ───── Decorative Background ───── */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* ───── Mobile Sidebar Overlay ───── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm md:hidden cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* ───── Sidebar ───── */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[110] flex flex-col bg-secondary/70 backdrop-blur-3xl border-r border-border/40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'md:w-[88px]' : 'md:w-64'} w-72`}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center ${collapsed && !isMobileOpen ? 'justify-center' : 'justify-between px-6'} py-8 border-b border-border/10 shrink-0`}>
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="w-11 h-11 rounded-xl bg-accent text-primary flex items-center justify-center shadow-[0_8px_20px_rgba(var(--accent-rgb),0.3)] shrink-0">
              <FiShield size={22} />
            </div>
            {(!collapsed || isMobileOpen) && (
              <div className="overflow-hidden min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-accent">
                  Nexus
                </p>
                <p className="text-lg font-display font-black text-text-primary leading-none mt-1 uppercase italic">
                  Admin
                </p>
              </div>
            )}
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="p-2 md:hidden text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-10 px-4 space-y-3 overflow-y-auto no-scrollbar scroll-smooth">
          <div className="px-4 mb-4">
               {(!collapsed || isMobileOpen) && (
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary mb-4 opacity-100">Main Menu</p>
               )}
          </div>
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-500 relative group overflow-hidden ${
                  isActive
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav-bg"
                      className="absolute inset-0 bg-accent shadow-[0_8px_25px_rgba(var(--accent-rgb),0.3)] z-0"
                    />
                  )}
                  <link.icon
                    size={20}
                    className={`relative z-10 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                  />
                  {(!collapsed || isMobileOpen) && (
                    <span className="relative z-10 truncate font-display tracking-tight uppercase italic">{link.name}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border/10 px-4 py-8 space-y-4 shrink-0 bg-primary/20 backdrop-blur-sm">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-tight italic text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-primary transition-all group active:scale-95"
          >
            <FiArrowLeft size={20} className="shrink-0 group-hover:-translate-x-2 transition-transform duration-300" />
            {(!collapsed || isMobileOpen) && <span>Exit to Hub</span>}
          </button>

          <div className="flex items-center gap-2 w-full justify-between">
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="hidden md:flex flex-1 items-center gap-4 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary hover:text-accent transition-all cursor-pointer"
            >
              {collapsed ? (
                <FiChevronRight size={18} className="shrink-0 mx-auto" />
              ) : (
                <>
                  <FiChevronLeft size={18} className="shrink-0" />
                  <span>Minimize</span>
                </>
              )}
            </button>
            <div className={`flex justify-center shrink-0 ${collapsed ? 'w-full' : 'mr-4'}`}>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      {/* ───── Main Content ───── */}
      <main
        className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] min-w-0 ${
          collapsed ? 'md:ml-[88px]' : 'md:ml-64'
        } ml-0 relative z-10`}
      >
        {/* Mobile Header Toggle */}
        <div className="sticky top-0 md:hidden px-4 z-30 transition-all duration-300 pt-2">
          <div className="py-6 flex items-center justify-between gap-4 bg-primary/80 backdrop-blur-md rounded-3xl border border-border/10 px-6 -mx-4 shadow-sm">
             <button
              onClick={() => setIsMobileOpen(true)}
              className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent shadow-premium active:scale-90 transition-all cursor-pointer"
              aria-label="Open sidebar"
            >
              <FiMenu size={22} />
            </button>
            <h1 className="text-xl font-black uppercase tracking-[0.2em] font-branding italic shrink-0">
               <span className="text-text-primary">Cinema</span><span className="text-accent">Hub</span> <span className="text-xs font-normal border-l border-border/40 pl-3 ml-1">Admin</span>
            </h1>
            <div className="w-10 h-10 rounded-full bg-surface border border-border/30 overflow-hidden">
                {user?.avatar && <img src={user.avatar} className="w-full h-full object-cover" alt="" />}
            </div>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="p-6 md:p-10 lg:p-14 max-w-[1600px] mx-auto w-full min-h-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <Outlet />
                </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
