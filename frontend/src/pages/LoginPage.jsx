import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { FiMail, FiLock, FiEye, FiEyeOff, FiCompass } from 'react-icons/fi';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, isAuthenticated } = useSelector(s => s.auth);
  const from = location.state?.from?.pathname || '/home';

  useEffect(() => { if (isAuthenticated) navigate(from, { replace: true }); }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px]" />
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gold-500 flex items-center justify-center shadow-gold">
              <FiCompass className="text-navy-900 text-xl" />
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/50">Sign in to continue exploring Lucknow</p>
        </div>
        <div className="glass rounded-3xl p-8 gold-border">
          {/* Demo credentials */}
          <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-3 mb-6 text-xs text-white/60">
            <p className="text-gold-400 font-semibold mb-1">Demo Credentials</p>
            <p>Admin: admin@lucknowexplore.com / Admin@123</p>
            <p>User: user@lucknowexplore.com / User@123</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="your@email.com" required className="input-dark pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="Your password" required className="input-dark pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full py-4 text-base disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-white/50 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
