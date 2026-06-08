import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './store/slices/authSlice';
import { setOnlineStatus } from './store/slices/uiSlice';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import OfflineBanner from './components/common/OfflineBanner';

// Pages
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import PlaceDetailPage from './pages/PlaceDetailPage';
import EventsPage from './pages/EventsPage';
import HotelsPage from './pages/HotelsPage';
import RestaurantsPage from './pages/RestaurantsPage';
import FoodCulturePage from './pages/FoodCulturePage';
import QRScannerPage from './pages/QRScannerPage';
import AIPlanner from './pages/AIPlanner';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Auth Guards
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token, initialLoading } = useSelector(s => s.auth);
  const isOnline = useSelector(s => s.ui.isOnline);

  // Auto-login if token exists
  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    } else {
      dispatch({ type: 'auth/setInitialLoading', payload: false });
    }
  }, [dispatch, token]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => dispatch(setOnlineStatus(true));
    const handleOffline = () => dispatch(setOnlineStatus(false));
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="gold-text font-display text-xl">Lucknow Explore</p>
        </div>
      </div>
    );
  }

  const isLandingPage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-navy-900">
      {!isOnline && <OfflineBanner />}
      {!isLandingPage && <Navbar />}

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Routes location={location}>
              {/* Public */}
              <Route path="/"            element={<LandingPage />} />
              <Route path="/home"        element={<HomePage />} />
              <Route path="/explore"     element={<ExplorePage />} />
              <Route path="/places/:slug" element={<PlaceDetailPage />} />
              <Route path="/events"      element={<EventsPage />} />
              <Route path="/hotels"      element={<HotelsPage />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route path="/food-culture" element={<FoodCulturePage />} />
              <Route path="/qr-scanner"  element={<QRScannerPage />} />
              <Route path="/ai-planner"  element={<AIPlanner />} />
              <Route path="/about"       element={<AboutPage />} />
              <Route path="/contact"     element={<ContactPage />} />
              <Route path="/login"       element={<LoginPage />} />
              <Route path="/register"    element={<RegisterPage />} />

              {/* Protected (logged in users) */}
              <Route path="/dashboard"   element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

              {/* Admin only */}
              <Route path="/admin/*"     element={<AdminRoute><AdminDashboard /></AdminRoute>} />

              {/* 404 */}
              <Route path="*"            element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {!isLandingPage && <Footer />}
    </div>
  );
}

export default App;
