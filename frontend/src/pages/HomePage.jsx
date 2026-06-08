import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrendingPlaces, fetchPlaces } from '../store/slices/placesSlice';
import PlaceCard from '../components/places/PlaceCard';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { FiArrowRight, FiCamera, FiCompass, FiZap } from 'react-icons/fi';

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass gold-border rounded-full px-4 py-2 mb-6"
          >
            <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
            <span className="text-sm text-gold-400">Welcome to Lucknow Explore</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4"
          >
            Discover the Heart of{' '}
            <span className="gold-text">Nawabi Culture</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/55 text-lg max-w-xl leading-relaxed mb-8"
          >
            Heritage monuments, legendary cuisine, cultural events — explore it all with AI-guided smart tourism.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Link to="/explore" className="btn-gold flex items-center gap-2">
              <FiCompass /> Explore Places
            </Link>
            <Link to="/ai-planner" className="btn-outline-gold flex items-center gap-2">
              <FiZap /> AI Planner
            </Link>
            <Link to="/qr-scanner" className="btn-outline-gold flex items-center gap-2">
              <FiCamera /> QR Scanner
            </Link>
          </motion.div>
        </div>

        {/* Hero Image Banner */}
        {/* ADD HERO BANNER IMAGE HERE - 1200x500px panoramic view of Lucknow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-12 relative h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden glass gold-border"
        >
          <div className="absolute inset-0 flex items-center justify-center text-white/20 flex-col gap-2">
            <FiCamera size={48} />
            <p className="text-sm">ADD HERO BANNER IMAGE HERE</p>
            <p className="text-xs">Recommended: 1200×500px panoramic view of Lucknow</p>
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/60 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <p className="text-white/60 text-sm">📍 Lucknow, Uttar Pradesh</p>
            <p className="font-display text-2xl font-bold text-white">The City of Nawabs</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Quick Links ──────────────────────────────────────────────────────────────
function QuickLinks() {
  const links = [
    { emoji: '🏛️', label: 'Heritage', to: '/explore?category=historical' },
    { emoji: '🍢', label: 'Food', to: '/food-culture' },
    { emoji: '🎭', label: 'Events', to: '/events' },
    { emoji: '🏨', label: 'Hotels', to: '/hotels' },
    { emoji: '🍽️', label: 'Restaurants', to: '/restaurants' },
    { emoji: '📱', label: 'QR Scan', to: '/qr-scanner' },
    { emoji: '🤖', label: 'AI Plan', to: '/ai-planner' },
    { emoji: '🛍️', label: 'Shopping', to: '/explore?category=shopping' },
  ];

  return (
    <section className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {links.map(({ emoji, label, to }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={to}
                className="glass rounded-2xl p-3 flex flex-col items-center gap-2 gold-border-hover border border-white/5 transition-all duration-200 hover:border-gold-500/30 hover:bg-gold-500/5 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{emoji}</span>
                <span className="text-xs text-white/60 group-hover:text-gold-400 transition-colors font-medium">{label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main HomePage ────────────────────────────────────────────────────────────
export default function HomePage() {
  const dispatch = useDispatch();
  const { trending, list: places, loading, trendingLoading } = useSelector(s => s.places);

  useEffect(() => {
    dispatch(fetchTrendingPlaces());
    dispatch(fetchPlaces({ limit: 8, sort: '-rating' }));
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <QuickLinks />

      {/* Trending Section */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title mb-1">🔥 Trending Now</h2>
              <p className="text-white/45 text-sm">Most visited places this month</p>
            </div>
            <Link to="/explore?trending=true" className="text-gold-400 hover:text-gold-300 text-sm flex items-center gap-1">
              View all <FiArrowRight size={14} />
            </Link>
          </div>

          {trendingLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trending.map((place, i) => (
                <motion.div
                  key={place._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <PlaceCard place={place} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* All Places */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title mb-1">🏛️ Explore Lucknow</h2>
              <p className="text-white/45 text-sm">Top-rated tourist destinations</p>
            </div>
            <Link to="/explore" className="text-gold-400 hover:text-gold-300 text-sm flex items-center gap-1">
              View all <FiArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {places.map((place, i) => (
                <motion.div
                  key={place._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <PlaceCard place={place} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Planner Banner */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 gold-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="text-4xl mb-3">🤖</div>
                <h2 className="font-display text-3xl font-bold text-white mb-2">Plan with AI</h2>
                <p className="text-white/55 max-w-md">
                  Tell our AI your interests, budget and duration — get a personalized Lucknow itinerary in seconds.
                </p>
              </div>
              <Link to="/ai-planner" className="btn-gold flex items-center gap-2 whitespace-nowrap px-8 py-4 text-base">
                Try AI Planner <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
