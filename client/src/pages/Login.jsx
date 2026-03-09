import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiFilm } from 'react-icons/fi';
import { useLoginMutation } from '../features/auth/authApi';
import { setUser } from '../features/auth/authSlice';
import Toast from '../components/ui/Toast';
import PageTransition from '../components/layout/PageTransition';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();
  const redirectTo = location.state?.from?.pathname || '/home';

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await login({ email, password }).unwrap();
      // Store token in localStorage for axios interceptor
      localStorage.setItem('token', res.token);
      dispatch(setUser(res));
      setToast({ show: true, message: 'Welcome back!', type: 'success' });
      setTimeout(() => navigate(redirectTo, { replace: true }), 500);
    } catch (err) {
      const message = err?.data?.message || err?.data?.error || 'Login failed. Please try again.';
      setToast({ show: true, message, type: 'error' });
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-primary flex items-center justify-center px-4 py-20 relative overflow-hidden">

        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/3 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/4 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/2 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-full max-w-md z-10"
        >
          {/* Card */}
          <div className="bg-secondary/60 backdrop-blur-xl border border-border/40 rounded-2xl p-8 md:p-10 shadow-elevated">

            {/* Header */}
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
                Welcome back
              </h1>
              <p className="text-text-muted text-sm">
                Sign in to your account to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-text-secondary mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                    placeholder="you@example.com"
                    className={`w-full bg-white/4 border rounded-xl py-3 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-danger/50 focus:ring-danger/20'
                        : 'border-border/40 focus:border-accent/50 focus:ring-accent/20'
                    }`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-danger text-xs mt-1.5 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-text-secondary mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                    placeholder="••••••••"
                    className={`w-full bg-white/4 border rounded-xl py-3 pl-11 pr-11 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? 'border-danger/50 focus:ring-danger/20'
                        : 'border-border/40 focus:border-accent/50 focus:ring-accent/20'
                    }`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-danger text-xs mt-1.5 ml-1">{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <FiLogIn size={16} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border/40" />
              <span className="text-text-muted text-xs font-medium">OR</span>
              <div className="flex-1 h-px bg-border/40" />
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent hover:text-accent-hover font-semibold transition-colors">
                Create one
              </Link>
            </p>
          </div>

          {/* Bottom decoration text */}
          <p className="text-center text-text-muted text-[11px] mt-6">
            By continuing, you agree to CinemaHub's Terms of Service and Privacy Policy.
          </p>
        </motion.div>

        {/* Toast */}
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

export default Login;
