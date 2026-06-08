import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCompass, FiArrowRight, FiStar, FiUsers, FiMap, FiCpu } from 'react-icons/fi';

const stats = [
  { icon: FiMap, value: '10+', label: 'Tourist Places' },
  { icon: FiStar, value: '4.8', label: 'Avg Rating' },
  { icon: FiUsers, value: '50K+', label: 'Happy Visitors' },
  { icon: FiCpu, value: 'AI', label: 'Powered' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-900 overflow-hidden">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">

        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[100px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        {/* Navbar minimal */}
        <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gold-500 flex items-center justify-center shadow-gold">
              <FiCompass className="text-navy-900 text-lg" />
            </div>
            <span className="font-display font-bold text-lg gold-text">Lucknow Explore</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-white/60 hover:text-white transition-colors px-3 py-2">Sign In</Link>
            <Link to="/register" className="btn-gold text-sm">Get Started</Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass gold-border rounded-full px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-sm text-gold-400 font-medium">Smart Tourism Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6"
          >
            <span className="text-white">Explore</span><br />
            <span className="gold-text">Lucknow</span><br />
            <span className="text-white/70 text-4xl sm:text-5xl md:text-6xl">Like Never Before</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/55 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Discover the City of Nawabs with AI-powered travel planning, QR-based smart exploration, 
            offline support, and curated experiences of heritage, food &amp; culture.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/home"
              className="btn-gold flex items-center justify-center gap-2 text-base px-8 py-4 rounded-2xl group"
            >
              Start Exploring
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/qr-scanner"
              className="btn-outline-gold flex items-center justify-center gap-2 text-base px-8 py-4 rounded-2xl"
            >
              Scan a QR Code
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="glass rounded-2xl p-4 text-center gold-border">
                <Icon className="text-gold-400 text-2xl mx-auto mb-2" />
                <div className="font-display font-bold text-2xl gold-text">{value}</div>
                <div className="text-white/50 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 text-xs"
        >
          <div className="w-px h-8 bg-gold-500/30 animate-pulse" />
          <span>Scroll to explore</span>
        </motion.div>
      </div>

      {/* ─── Feature Highlights ──────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">Why Lucknow Explore?</h2>
          <p className="text-white/50 max-w-xl mx-auto">Built for modern travelers who want smart, immersive, and culturally-rich experiences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { emoji: '🏛️', title: 'Heritage Places', desc: 'Explore 10+ iconic tourist spots with rich history, timings, entry fees and interactive maps.' },
            { emoji: '🤖', title: 'AI Travel Planner', desc: 'Get a personalized AI-generated itinerary based on your interests, duration and budget.' },
            { emoji: '📱', title: 'QR Smart Tourism', desc: 'Scan QR codes at tourist spots to instantly access history, info, and reviews.' },
            { emoji: '📶', title: 'Offline Support', desc: 'Full PWA with offline mode — access places and info even without internet.' },
            { emoji: '🍢', title: 'Food & Culture', desc: 'Discover Awadhi cuisine, legendary street food, and rich cultural traditions.' },
            { emoji: '🗺️', title: 'Interactive Maps', desc: 'Live maps with nearby attractions, walking routes, and geo-tagged locations.' },
          ].map(({ emoji, title, desc }) => (
            <motion.div
              key={title}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 gold-border gold-border-hover transition-all duration-300"
            >
              <span className="text-4xl mb-4 block">{emoji}</span>
              <h3 className="font-display font-semibold text-lg text-white mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center">
          <div className="glass rounded-3xl p-12 gold-border max-w-2xl mx-auto">
            <h3 className="font-display text-3xl font-bold text-white mb-4">Ready to Discover Lucknow?</h3>
            <p className="text-white/50 mb-8">Join thousands of explorers who've uncovered the magic of the City of Nawabs.</p>
            <Link to="/register" className="btn-gold text-base px-10 py-4 rounded-2xl inline-flex items-center gap-2">
              Create Free Account <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
