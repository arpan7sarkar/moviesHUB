import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiLock, FiLogOut, FiSave, FiEdit2 } from 'react-icons/fi';
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
      const updateData = { name: formData.name, email: formData.email };
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
      navigate('/login');
    } catch (err) {
      dispatch(logout());
      navigate('/login');
    }
  };

  if (!user) return null;

  const memberSince = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recent Member';

  return (
    <PageTransition>
      <div className="min-h-screen bg-primary pt-[4.5rem] md:pt-20 pb-20">
        <div className="container-custom max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: User Card */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-secondary rounded-2xl p-8 border border-border shadow-elevated flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-elevated border-2 border-accent p-1 mb-4">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} loading="lazy" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center bg-surface text-accent">
                      <FiUser size={40} />
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-display font-bold text-text-primary mb-1">{user.name}</h2>
                <p className="text-text-muted text-sm mb-6">{user.role || 'Member'}</p>
                
                <div className="w-full space-y-4 pt-6 border-t border-border">
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <FiMail className="text-accent" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <FiCalendar className="text-accent" />
                    <span>Member since {memberSince}</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-10 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-danger/10 hover:bg-danger/20 text-danger font-semibold transition-all group cursor-pointer"
                >
                  <FiLogOut className="group-hover:translate-x-1 transition-transform" />
                  Logout
                </button>
              </motion.div>
            </div>

            {/* Right Column: Settings Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary rounded-2xl p-8 border border-border shadow-elevated"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-display font-bold text-text-primary">Profile Settings</h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors cursor-pointer"
                    >
                      <FiEdit2 /> Edit Profile
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Display Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full bg-elevated/50 border border-border rounded-xl py-3 px-4 text-text-primary focus:outline-none focus:border-accent disabled:opacity-50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full bg-elevated/50 border border-border rounded-xl py-3 px-4 text-text-primary focus:outline-none focus:border-accent disabled:opacity-50 transition-all"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-6 pt-4 border-t border-border mt-6"
                    >
                      <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <FiLock className="text-accent" /> Change Password
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">New Password</label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min. 6 characters"
                            className="w-full bg-elevated/50 border border-border rounded-xl py-3 px-4 text-text-primary focus:outline-none focus:border-accent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-type password"
                            className="w-full bg-elevated/50 border border-border rounded-xl py-3 px-4 text-text-primary focus:outline-none focus:border-accent transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-4">
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="flex-1 btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                          {isUpdating ? <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <><FiSave /> Save Changes</>}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              name: user.name,
                              email: user.email,
                              password: '',
                              confirmPassword: '',
                            });
                          }}
                          className="flex-1 py-3 px-4 border border-border rounded-xl text-text-secondary font-bold hover:bg-elevated transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
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
