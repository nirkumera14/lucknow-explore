import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/slices/authSlice';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiCompass } from 'react-icons/fi';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useSelector(s => s.auth);

  useEffect(() => { if (isAuthenticated) navigate('/home', { replace: true }); }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => { e.preventDefault(); dispatch(registerUser(form)); };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px]" />
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gold-500 flex items-center justify-center shadow-gold"><FiCompass className="text-navy-900 text-xl" /></div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/50">Join thousands of Lucknow explorers</p>
        </div>
        <div className="glass rounded-3xl p-8 gold-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { field: 'name', label: 'Full Name', icon: FiUser, type: 'text', placeholder: 'Your full name' },
              { field: 'email', label: 'Email Address', icon: FiMail, type: 'email', placeholder: 'your@email.com' },
              { field: 'phone', label: 'Phone (optional)', icon: FiPhone, type: 'tel', placeholder: '+91 XXXXX XXXXX' },
            ].map(({ field, label, icon: Icon, type, placeholder }) => (
              <div key={field}>
                <label className="block text-sm text-white/70 mb-2">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input type={type} value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})}
                    placeholder={placeholder} required={field !== 'phone'} className="input-dark pl-10" />
                </div>
              </div>
            ))}
            <div>
              <label className="block text-sm text-white/70 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="Min 6 characters" required minLength={6} className="input-dark pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full py-4 text-base disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Create Free Account'}
            </button>
          </form>
          <p className="text-center text-white/50 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
