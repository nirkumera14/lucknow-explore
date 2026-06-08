import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCompass } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-24 h-24 rounded-3xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-8">
          <FiCompass className="text-gold-400 text-4xl" />
        </div>
        <h1 className="font-display text-8xl font-bold gold-text mb-4">404</h1>
        <h2 className="font-display text-2xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-white/50 max-w-sm mx-auto mb-8">
          Looks like this route got lost in the labyrinth of Bara Imambara! Let's get you back on track.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/home" className="btn-gold flex items-center gap-2">
            <FiArrowLeft /> Go Home
          </Link>
          <Link to="/explore" className="btn-outline-gold flex items-center gap-2">
            <FiCompass /> Explore
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
