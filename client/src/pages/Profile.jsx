import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiLock, FiLogOut, FiSave, FiEdit2, FiImage, FiShield, FiActivity, FiSettings } from 'react-icons/fi';
import { useUpdateProfileMutation, useLogoutMutation } from '../features/auth/authApi';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/ui/Toast';
import PageTransition from '../components/layout/PageTransition';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [logoutUser] = useLogoutMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    password: '',
    confirmPassword: '',
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      setToast({ show: true, message: 'Passwords do not match', type: 'error' });
      return;
    }

    try {
      const updateData = { name: formData.name, email: formData.email, avatar: formData.avatar };
      if (formData.password) updateData.password = formData.password;

      await updateProfile(updateData).unwrap();
      setToast({ show: true, message: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      setToast({ show: true, message: err?.data?.message || 'Update failed', type: 'error' });
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      localStorage.removeItem('token');
      dispatch(logout());
      navigate('/');
    } catch {
      dispatch(logout());
      navigate('/');
    }
  };

  if (!user) return null;

  const memberSince = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
    : 'UNKNOWN';

  return (
    <PageTransition>
      <div className="min-h-screen bg-primary pt-24 md:pt-32 pb-20 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/20 blur-[150px] rounded-full -translate-y-1/2" />
        </div>

        <div className="container-custom max-w-5xl relative z-10 space-y-10">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent flex items-center gap-3">
                        <span className="w-10 h-px bg-accent/30" /> User Details
                    </p>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-text-primary uppercase italic tracking-tighter">
                        User <span className="text-accent">Profile</span>
                    </h1>
                </div>
                
                <div className="shrink-0 flex items-center gap-3 bg-accent/5 border border-accent/20 rounded-2xl px-6 py-4 backdrop-blur-md">
                    <div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" />
                    <span className="text-xs font-black uppercase tracking-widest text-accent">Online</span>
                </div>
            </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: User Card */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-secondary/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 shadow-elevated flex flex-col items-center text-center relative overflow-hidden"
              >
                {/* Background glow in card */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent/20 blur-[50px] rounded-full pointer-events-none" />

                <div className="relative w-32 h-32 rounded-3xl bg-primary/80 border border-border/40 p-1 mb-6 shadow-inner z-10 overflow-visible group">
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-surface relative">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted font-display text-4xl font-black">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  {user.role === 'admin' && (
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-primary shadow-[0_5px_15px_rgba(var(--accent-rgb),0.5)] border border-primary/20 z-20" title="Administrator">
                        <FiShield size={18} />
                    </div>
                  )}
                </div>
                
                <h2 className="text-2xl font-display font-black text-text-primary uppercase italic tracking-tight">{user.name}</h2>
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-border/20 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                    <FiActivity size={10} className="text-accent" />
                    {user.role === 'admin' ? 'Admin' : 'User'}
                </div>
                
                <div className="w-full space-y-4 pt-8 mt-8 border-t border-border/10">
                  <div className="flex items-center justify-center gap-3 text-xs font-bold font-mono text-text-muted/60">
                    <FiMail className="text-accent" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-xs font-bold font-mono text-text-muted/60">
                    <FiCalendar className="text-accent" />
                    <span>MEMBER SINCE {memberSince}</span>
                  </div>
                </div>

                <div className="w-full mt-8 pt-8 border-t border-border/10">
                    <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-danger/10 border border-danger/30 hover:bg-danger text-danger hover:text-white font-black text-xs uppercase tracking-widest transition-all duration-300 group cursor-pointer shadow-card"
                    >
                        <FiLogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Log Out
                    </button>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Settings Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-secondary/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 md:p-10 shadow-elevated"
              >
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/10">
                  <h3 className="text-xl font-display font-black text-text-primary uppercase italic tracking-tight flex items-center gap-3">
                    <FiSettings className="text-accent" /> Profile <span className="text-text-muted/50 italic">Settings</span>
                  </h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-border/20 text-xs font-black uppercase tracking-widest text-text-muted hover:text-accent hover:border-accent/40 shadow-sm transition-all cursor-pointer group active:scale-95"
                    >
                      <FiEdit2 className="group-hover:-rotate-12 transition-transform" /> Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted group-focus-within:text-accent transition-colors flex items-center gap-2">
                            <FiUser size={12} /> Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full bg-primary/40 border border-border/20 rounded-2xl py-4 px-5 text-sm font-bold text-text-primary focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 disabled:opacity-40 transition-all font-display italic"
                        />
                    </div>
                    
                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted group-focus-within:text-accent transition-colors flex items-center gap-2">
                            <FiMail size={12} /> Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full bg-primary/40 border border-border/20 rounded-2xl py-4 px-5 text-sm font-bold text-text-primary focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 disabled:opacity-40 transition-all"
                        />
                    </div>
                    
                    <div className="md:col-span-2 space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted group-focus-within:text-accent transition-colors flex items-center gap-2">
                            <FiImage size={12} /> Profile Image URL
                        </label>
                        <input
                            type="text"
                            name="avatar"
                            value={formData.avatar}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            disabled={!isEditing}
                            className="w-full bg-primary/40 border border-border/20 rounded-2xl py-4 px-5 text-sm text-text-primary focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 disabled:opacity-40 transition-all font-mono placeholder:text-text-muted/30"
                        />
                        {isEditing && formData.avatar && (
                            <p className="text-[9px] text-text-muted/60 uppercase tracking-widest mt-2">Remote image feeds must be publicly accessible.</p>
                        )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isEditing && (
                        <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6 pt-6 border-t border-border/10 overflow-hidden"
                        >
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-primary inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl mb-2">
                            <FiLock className="text-accent" /> Password Settings
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/10 rounded-2xl p-6 border border-border/10">
                            <div className="space-y-2 group">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted group-focus-within:text-accent transition-colors">New Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Min. 6 characters"
                                className="w-full bg-primary/60 border border-border/20 rounded-xl py-3 px-4 text-sm font-bold text-text-primary focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all font-mono"
                            />
                            </div>
                            <div className="space-y-2 group">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted group-focus-within:text-accent transition-colors">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-type password"
                                className="w-full bg-primary/60 border border-border/20 rounded-xl py-3 px-4 text-sm font-bold text-text-primary focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all font-mono"
                            />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            <button
                            type="submit"
                            disabled={isUpdating}
                            className="w-full sm:flex-1 py-4 bg-accent text-primary rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-accent/20 cursor-pointer shadow-[0_8px_20px_rgba(var(--accent-rgb),0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 disabled:shadow-none italic"
                            >
                            {isUpdating ? (
                                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <><FiSave size={16} /> Save Changes</>
                            )}
                            </button>
                            <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                name: user.name,
                                email: user.email,
                                avatar: user.avatar || '',
                                password: '',
                                confirmPassword: '',
                                });
                            }}
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-border/20 rounded-2xl text-xs font-black uppercase tracking-widest text-text-muted hover:bg-white/10 hover:text-text-primary transition-all cursor-pointer active:scale-95 text-center"
                            >
                            Cancel
                            </button>
                        </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </motion.div>
            </div>

          </div>
        </div>

        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
        />
      </div>
    </PageTransition>
  );
};

export default Profile;
