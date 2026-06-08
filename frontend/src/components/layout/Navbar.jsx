import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
  FiMenu, FiX, FiUser, FiLogOut, FiSettings,
  FiCompass, FiCamera, FiCalendar, FiStar, FiCpu
} from 'react-icons/fi';

const navLinks = [
  { to: '/home',        label: 'Home' },
  { to: '/explore',     label: 'Explore' },
  { to: '/events',      label: 'Events' },
  { to: '/hotels',      label: 'Hotels' },
  { to: '/restaurants', label: 'Restaurants' },
  { to: '/food-culture',label: 'Food & Culture' },
  { to: '/qr-scanner',  label: 'QR Scanner' },
  { to: '/ai-planner',  label: 'AI Planner' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-dark shadow-card py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gold-500 flex items-center justify-center shadow-gold">
            <FiCompass className="text-navy-900 text-lg" />
          </div>
          <span className="font-display font-bold text-xl gold-text hidden sm:block">Lucknow Explore</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-gold-400 bg-gold-500/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 glass gold-border rounded-xl px-3 py-2 hover:border-gold-400/50 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center overflow-hidden">
                  {/* ADD USER AVATAR HERE */}
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    : <FiUser className="text-gold-400 text-sm" />
                  }
                </div>
                <span className="text-sm font-medium text-white/90 hidden sm:block max-w-[120px] truncate">
                  {user.name}
                </span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 glass-dark rounded-2xl border border-white/10 shadow-card-hover overflow-hidden"
                  >
                    <div className="p-3 border-b border-white/10">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-white/50 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/5 hover:text-gold-400 transition-all"
                      >
                        <FiUser className="text-xs" /> My Dashboard
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/5 hover:text-gold-400 transition-all"
                        >
                          <FiSettings className="text-xs" /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <FiLogOut className="text-xs" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm text-white/70 hover:text-white px-3 py-2 transition-colors">Login</Link>
              <Link to="/register" className="btn-gold text-sm px-4 py-2">Get Started</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden glass rounded-xl p-2 text-white/80 hover:text-white"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-dark border-t border-white/10 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'bg-gold-500/15 text-gold-400' : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {profileOpen && <div className="fixed inset-0 z-[-1]" onClick={() => setProfileOpen(false)} />}
    </motion.nav>
  );
}
