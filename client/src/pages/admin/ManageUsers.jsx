import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiTrash2, FiChevronLeft, FiChevronRight, FiUser, FiCheckCircle, FiXCircle, FiShield, FiUserPlus, FiLock, FiUnlock, FiMail, FiInbox } from 'react-icons/fi';
import { useGetUsersQuery, useBanUserMutation, useDeleteUserMutation, useUpdateUserRoleMutation } from '../../features/admin/adminApi';
import { useSelector } from 'react-redux';

const ManageUsers = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { user: currentUser } = useSelector((state) => state.auth);

  const { data, isLoading, isFetching } = useGetUsersQuery({ page, search });
  const [banUser, { isLoading: isBanning }] = useBanUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleBanToggle = async (user) => {
    if (user.role === 'admin') return;
    try {
      await banUser(user._id).unwrap();
    } catch (err) {
      console.error('Failed to toggle ban status:', err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole({ id: userId, role: newRole }).unwrap();
    } catch (err) {
      console.error('Failed to update user role:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget._id).unwrap();
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  return (
    <div className="space-y-10">
      {/* ───── Page Header ───── */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent flex items-center gap-3">
            <span className="w-10 h-px bg-accent/30" /> User Management
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-black text-text-primary uppercase italic tracking-tighter">
            User <span className="text-accent">Directory</span>
          </h1>
          <p className="text-text-muted text-md font-medium opacity-80 max-w-xl">
            Monitor registration trends and manage access for platform users.
          </p>
        </div>
        
        <div className="shrink-0 flex items-center gap-6 bg-accent/5 border border-accent/20 rounded-2xl px-8 py-5 backdrop-blur-md italic">
            <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/60">Total Users</p>
                <p className="text-2xl font-display font-black text-text-primary">{total.toLocaleString()} USERS</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent text-primary flex items-center justify-center shadow-lg">
                <FiUserPlus size={24} />
            </div>
        </div>
      </motion.div>

      {/* ───── Search Intelligence ───── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 bg-secondary/30 backdrop-blur-md p-3 rounded-[2rem] border border-border/10 shadow-premium"
      >
        <form onSubmit={handleSearch} className="relative flex-1 group">
          <FiSearch
            size={18}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors"
          />
          <input
            type="text"
            placeholder="Search users..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-primary/40 border border-border/20 rounded-2xl text-sm font-bold text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all"
          />
        </form>
      </motion.div>

      {/* ───── User Grid/Table ───── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-secondary/20 backdrop-blur-xl border border-border/20 rounded-[2.5rem] overflow-hidden shadow-elevated"
      >
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-8 py-6 font-black text-text-muted text-[10px] uppercase tracking-[0.3em] border-b border-border/10">User</th>
                <th className="px-8 py-6 font-black text-text-muted text-[10px] uppercase tracking-[0.3em] border-b border-border/10 hidden md:table-cell">Joined</th>
                <th className="px-8 py-6 font-black text-text-muted text-[10px] uppercase tracking-[0.3em] border-b border-border/10 hidden sm:table-cell">Role</th>
                <th className="px-8 py-6 font-black text-text-muted text-[10px] uppercase tracking-[0.3em] border-b border-border/10">Status</th>
                <th className="px-8 py-6 font-black text-text-muted text-[10px] uppercase tracking-[0.3em] border-b border-border/10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/5">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6" colSpan={5}>
                      <div className="h-14 bg-white/5 rounded-2xl w-full" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                        <FiInbox size={60} />
                        <div className="space-y-2">
                             <p className="text-xl font-display font-black uppercase italic tracking-widest">No Matches</p>
                             <p className="text-xs font-bold font-mono">No users matching your search</p>
                        </div>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-white/5 transition-all duration-300"
                  >
                    {/* User info */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-5">
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-elevated border border-border/40 group-hover:border-accent/40 transition-all duration-500 shadow-inner p-1 group-hover:scale-105">
                                <div className="w-full h-full rounded-xl overflow-hidden">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-text-muted bg-surface/50 font-black text-lg">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                                </div>
                            </div>
                            {user.role === 'admin' && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-lg flex items-center justify-center text-primary shadow-lg border border-primary/20">
                                    <FiShield size={10} />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-lg font-display font-black text-text-primary uppercase italic tracking-tight group-hover:text-accent transition-colors truncate max-w-[240px]">
                            {user.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-text-muted/60 font-mono text-[10px] group-hover:text-text-muted transition-colors">
                                <FiMail size={10} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="px-8 py-5 hidden md:table-cell">
                      <span className="text-xs font-bold text-text-muted/60 group-hover:text-text-primary transition-colors font-mono">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }).toUpperCase()}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="px-8 py-5 hidden sm:table-cell">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={isUpdatingRole || user._id === currentUser?._id}
                        className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-xl bg-primary/40 border focus:outline-none cursor-pointer transition-all flex items-center gap-2 ${
                          user.role === 'admin'
                            ? 'text-accent border-accent/30 hover:bg-accent/10 whitespace-nowrap'
                            : 'text-text-muted border-border/40 hover:text-text-primary hover:border-text-muted'
                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                      >
                        <option value="user" className="bg-primary text-text-primary">User</option>
                        <option value="admin" className="bg-primary text-text-primary">Admin</option>
                      </select>
                    </td>

                    {/* Status */}
                    <td className="px-8 py-5">
                      <span
                        className={`inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border border-dashed transition-colors ${
                          user.banned
                            ? 'bg-danger/5 text-danger border-danger/40 shadow-[0_0_10px_rgba(var(--danger-rgb),0.1)]'
                            : 'bg-emerald-400/5 text-emerald-400 border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${user.banned ? 'bg-danger animate-pulse' : 'bg-emerald-400'}`} />
                        {user.banned ? 'Banned' : 'Active'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 transition-all duration-300">
                        {user.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => handleBanToggle(user)}
                              disabled={isBanning}
                              className={`w-10 h-10 rounded-xl border border-border/20 flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
                                user.banned
                                  ? 'bg-accent/10 text-accent border-accent/30 hover:bg-accent/20'
                                  : 'bg-white/5 text-white/40 hover:text-danger hover:bg-danger/10 hover:border-danger/30'
                              }`}
                              title={user.banned ? 'Unban User' : 'Ban User'}
                            >
                              {user.banned ? <FiUnlock size={16} /> : <FiLock size={16} />}
                            </button>
                            <button
                              onClick={() => setDeleteTarget(user)}
                              disabled={isDeleting}
                              className="w-10 h-10 rounded-xl bg-white/5 border border-border/20 flex items-center justify-center text-white/40 hover:text-danger hover:bg-danger/10 hover:border-danger/30 transition-all active:scale-90 cursor-pointer"
                              title="Delete User"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-10 py-6 border-t border-border/10 bg-black/20">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-12 h-12 rounded-2xl border border-border/20 text-text-muted hover:bg-white/5 hover:text-accent hover:border-accent/20 disabled:opacity-10 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center active:scale-90"
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-12 h-12 rounded-2xl border border-border/20 text-text-muted hover:bg-white/5 hover:text-accent hover:border-accent/20 disabled:opacity-10 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center active:scale-90"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* ───── Delete Confirmation Modal ───── */}
      <AnimatePresence>
          {deleteTarget && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setDeleteTarget(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-secondary/95 border border-border/40 rounded-[3rem] p-10 max-w-md w-full shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
              >
                <div className="w-20 h-20 rounded-3xl bg-danger/10 border border-danger/30 flex items-center justify-center text-danger mb-8 mx-auto shadow-inner">
                    <FiTrash2 size={32} />
                </div>
                <h3 className="text-3xl font-display font-black text-text-primary uppercase italic text-center leading-tight">Delete <span className="text-danger">User</span></h3>
                <p className="text-md text-text-muted mt-4 text-center leading-relaxed">
                  Are you absolutely certain? Deleting <strong className="text-text-primary">{deleteTarget.name}</strong> will remove them from the system permanently.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-10">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-text-muted hover:bg-white/5 transition-all cursor-pointer border border-border/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-6 py-4 bg-danger text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-danger-hover transition-all disabled:opacity-50 cursor-pointer active:scale-95 italic"
                  >
                    {isDeleting ? 'Deleting...' : 'DELETE USER'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default ManageUsers;
