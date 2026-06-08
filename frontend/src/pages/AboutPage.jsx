import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCompass, FiArrowRight } from 'react-icons/fi';

const team = [
  { name: 'Lucknow Tourism Board', role: 'Partner Organization', emoji: '🏛️' },
  { name: 'UP Government', role: 'Technology Partner', emoji: '🤝' },
  { name: 'Heritage Trust', role: 'Content Partner', emoji: '📜' },
];

const features = [
  { emoji: '🏛️', title: '10+ Tourist Spots', desc: 'Detailed info on every iconic monument and attraction' },
  { emoji: '🤖', title: 'AI Travel Planner', desc: 'Claude AI-powered personalized itineraries' },
  { emoji: '📱', title: 'QR Smart Tourism', desc: 'Scan QR codes at venues for instant info' },
  { emoji: '📶', title: 'Offline PWA', desc: 'Full offline support via service workers' },
  { emoji: '🍢', title: 'Food & Culture', desc: 'Discover authentic Awadhi culinary heritage' },
  { emoji: '🗺️', title: 'Interactive Maps', desc: 'Leaflet-powered maps with live location' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="w-20 h-20 rounded-3xl bg-gold-500 flex items-center justify-center mx-auto mb-6 shadow-gold-lg">
            <FiCompass className="text-navy-900 text-3xl" />
          </div>
          <h1 className="font-display text-5xl font-bold gold-text mb-4">About Lucknow Explore</h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            A smart, AI-powered tourism platform built to help travelers and locals discover the magic of Lucknow — the City of Nawabs — with modern technology and timeless cultural depth.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-8 gold-border mb-10">
          <h2 className="font-display text-3xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-white/65 text-lg leading-relaxed">
            Lucknow is a city with centuries of history, remarkable cuisine, and a cultural legacy unmatched in India. Our mission is to make this heritage accessible to every traveler — with smart technology, AI-powered personalization, and offline-first design. We believe tourism should be immersive, informed, and inclusive.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {features.map(({ emoji, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              className="glass rounded-2xl p-5 gold-border">
              <span className="text-3xl mb-3 block">{emoji}</span>
              <h3 className="font-semibold text-white mb-1">{title}</h3>
              <p className="text-white/50 text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-8 gold-border mb-10">
          <h2 className="font-display text-2xl font-bold text-white mb-6">Built With Modern Tech</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['React + Vite', 'Node.js + Express', 'MongoDB', 'Tailwind CSS', 'Framer Motion', 'Leaflet Maps', 'PWA / SW', 'JWT Auth'].map(tech => (
              <div key={tech} className="bg-white/5 rounded-xl px-3 py-2.5 text-center text-sm text-gold-400 border border-white/10">{tech}</div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/explore" className="btn-gold inline-flex items-center gap-2 px-8 py-4 text-base">
            Start Exploring <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
