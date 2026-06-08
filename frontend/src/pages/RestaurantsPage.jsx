import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiCamera, FiClock } from 'react-icons/fi';
import api from '../utils/api';
import { SkeletonCard } from '../components/common/SkeletonCard';

const CATEGORIES = [{ value: '', label: 'All' }, { value: 'fine-dining', label: '🍷 Fine Dining' }, { value: 'casual', label: '🍽️ Casual' }, { value: 'street-food', label: '🌮 Street Food' }, { value: 'cafe', label: '☕ Café' }];

function RestaurantCard({ r, i }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
      className="glass rounded-2xl overflow-hidden gold-border hover:border-gold-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* ADD RESTAURANT IMAGE HERE */}
      <div className="relative h-48 bg-navy-700 flex items-center justify-center overflow-hidden">
        {r.thumbnailUrl && r.thumbnailUrl !== '/assets/placeholders/restaurant-placeholder.jpg' ? (
          <img src={r.thumbnailUrl} alt={r.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-white/20"><FiCamera size={32} /><p className="text-xs">ADD RESTAURANT IMAGE</p></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gold-500/90 text-navy-900 text-xs font-bold capitalize">{r.category}</span>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 glass rounded-full px-2 py-1">
          <FiStar size={11} className="text-gold-400" fill="#c9a84c" />
          <span className="text-xs text-white font-semibold">{r.rating?.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-lg text-white mb-1">{r.name}</h3>
        <p className="text-white/55 text-sm mb-3 line-clamp-2">{r.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {r.cuisine?.map(c => <span key={c} className="px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-xs border border-white/10">{c}</span>)}
        </div>
        <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
          <FiMapPin size={12} className="text-gold-400" />
          <span>{r.location?.area}</span>
        </div>
        <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
          <FiClock size={12} className="text-gold-400" />
          <span>{r.timings?.open} – {r.timings?.close}</span>
        </div>
        {r.specialDishes?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-white/40 mb-1.5">Must Try</p>
            <div className="flex flex-wrap gap-1.5">
              {r.specialDishes.slice(0, 3).map(d => <span key={d} className="px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 text-xs border border-gold-500/20">{d}</span>)}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div><p className="text-xs text-white/40">Avg for 2</p><p className="text-gold-400 font-bold">₹{r.priceForTwo}</p></div>
          <div className="flex gap-1.5">
            {r.features?.slice(0,2).map(f => <span key={f} className="px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-xs">{f}</span>)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = category ? `?category=${category}` : '';
    api.get(`/restaurants${params}`).then(({ data }) => { setRestaurants(data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title mb-2">🍽️ Restaurants in Lucknow</motion.h1>
        <p className="text-white/45 mb-8">From legendary Awadhi cuisine to modern cafés</p>
        <div className="flex flex-wrap gap-3 mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat.value} onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat.value ? 'bg-gold-500 text-navy-900' : 'glass gold-border text-white/60 hover:text-white'}`}>
              {cat.label}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{restaurants.map((r, i) => <RestaurantCard key={r._id} r={r} i={i} />)}</div>
        )}
      </div>
    </div>
  );
}
