import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiUserPlus, FiFilm } from 'react-icons/fi';
import { useRegisterMutation } from '../features/auth/authApi';
import { setUser } from '../features/auth/authSlice';
import Toast from '../components/ui/Toast';
import PageTransition from '../components/layout/PageTransition';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();
  const redirectTo = location.state?.from?.pathname || '/home';

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      }).unwrap();
      
      localStorage.setItem('token', res.token);
      dispatch(setUser(res));
      setToast({ show: true, message: 'Account created successfully!', type: 'success' });
      setTimeout(() => navigate(redirectTo, { replace: true }), 1000);
    } catch (err) {
      const message = err?.data?.message || err?.data?.error || 'Registration failed.';
      setToast({ show: true, message, type: 'error' });
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-primary flex items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-accent/3 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/4 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md z-10"
        >
          <div className="bg-secondary/60 backdrop-blur-xl border border-border/40 rounded-2xl p-8 md:p-10 shadow-elevated">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <FiFilm size={20} className="text-accent" />
                </div>
                <span className="text-xl font-branding font-bold text-accent">
                   <span className="text-text-primary">Cinema</span>Hub
                </span>
              </Link>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-2">
                Join CinemaHub
              </h1>
              <p className="text-text-muted text-sm">Create your account to start exploring</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
                <div className="relative">
                  <FiUser size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full bg-white/4 border rounded-xl py-2.5 pl-11 pr-4 text-sm text-text-primary focus:outline-none focus:ring-2 transition-all ${
                      errors.name ? 'border-danger/50 focus:ring-danger/20' : 'border-border/40 focus:border-accent/50 focus:ring-accent/20'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-danger text-[10px] mt-1 ml-1 font-medium">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Email address</label>
                <div className="relative">
                  <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full bg-white/4 border rounded-xl py-2.5 pl-11 pr-4 text-sm text-text-primary focus:outline-none focus:ring-2 transition-all ${
                      errors.email ? 'border-danger/50 focus:ring-danger/20' : 'border-border/40 focus:border-accent/50 focus:ring-accent/20'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-danger text-[10px] mt-1 ml-1 font-medium">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
                <div className="relative">
                  <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full bg-white/4 border rounded-xl py-2.5 pl-11 pr-11 text-sm text-text-primary focus:outline-none focus:ring-2 transition-all ${
                      errors.password ? 'border-danger/50 focus:ring-danger/20' : 'border-border/40 focus:border-accent/50 focus:ring-accent/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-danger text-[10px] mt-1 ml-1 font-medium">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Confirm Password</label>
                <div className="relative">
                  <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full bg-white/4 border rounded-xl py-2.5 pl-11 pr-4 text-sm text-text-primary focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword ? 'border-danger/50 focus:ring-danger/20' : 'border-border/40 focus:border-accent/50 focus:ring-accent/20'
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-danger text-[10px] mt-1 ml-1 font-medium">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 mt-4 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl disabled:opacity-60 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiUserPlus size={16} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border/40" />
              <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest">Already have an account?</span>
              <div className="flex-1 h-px bg-border/40" />
            </div>

            <p className="text-center text-sm text-text-muted">
              Already a member?{' '}
              <Link to="/login" className="text-accent hover:text-accent-hover font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>

        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.show}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      </main>
    </PageTransition>
  );
};

export default Register;
