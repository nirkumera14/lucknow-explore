import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCamera } from 'react-icons/fi';
import api from '../utils/api';
import { SkeletonCard } from '../components/common/SkeletonCard';

function FoodCard({ food, i }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
      className="glass rounded-2xl overflow-hidden gold-border hover:border-gold-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* ADD FOOD IMAGE HERE */}
      <div className="relative h-56 bg-navy-700 flex items-center justify-center overflow-hidden">
        {food.imageUrl && food.imageUrl !== '/assets/placeholders/food-placeholder.jpg' ? (
          <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-white/20"><FiCamera size={40} /><p className="text-xs">ADD FOOD IMAGE</p></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-full bg-gold-500/90 text-navy-900 text-xs font-bold capitalize">{food.category}</span>
          {food.isVegetarian && <span className="px-2.5 py-1 rounded-full bg-green-500/90 text-white text-xs font-bold">🌱 Veg</span>}
        </div>
        <div className="absolute bottom-3 left-3">
          <h3 className="font-display font-bold text-xl text-white">{food.name}</h3>
        </div>
      </div>
      <div className="p-5">
        <p className="text-white/65 text-sm leading-relaxed mb-4">{food.description}</p>
        {food.history && (
          <details className="mb-4">
            <summary className="text-gold-400 text-sm cursor-pointer hover:text-gold-300 font-medium">📜 Read History</summary>
            <p className="text-white/55 text-sm mt-2 leading-relaxed">{food.history}</p>
          </details>
        )}
        {food.bestPlaces?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-white/40 mb-2">Where to Find</p>
            <div className="space-y-1">
              {food.bestPlaces.map((p, j) => (
                <div key={j} className="flex items-center gap-2 text-sm">
                  <span className="text-gold-400">📍</span>
                  <span className="text-white/70 font-medium">{p.name}</span>
                  {p.address && <span className="text-white/40 text-xs">– {p.address}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${food.spiceLevel === 'mild' ? 'bg-green-500/20 text-green-400' : food.spiceLevel === 'spicy' || food.spiceLevel === 'very-spicy' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              🌶️ {food.spiceLevel}
            </span>
          </div>
          {food.averagePrice && <p className="text-gold-400 font-semibold">~₹{food.averagePrice}</p>}
        </div>
      </div>
    </motion.div>
  );
}

export default function FoodCulturePage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = vegOnly ? '?isVegetarian=true' : '';
    api.get(`/food${params}`).then(({ data }) => { setFoods(data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [vegOnly]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title mb-2">🍢 Lucknow Food & Culture</motion.h1>
        <p className="text-white/45 mb-8">Iconic Awadhi dishes that define the soul of Lucknow</p>

        {/* Culture Intro */}
        <div className="glass rounded-2xl p-8 gold-border mb-10">
          <h2 className="font-display text-2xl font-bold text-white mb-3">The Nawabi Culinary Legacy</h2>
          <p className="text-white/65 leading-relaxed">
            Lucknow's cuisine is one of India's most refined culinary traditions, developed in the royal kitchens of the Nawabs of Awadh. Known for its delicate spicing, aromatic use of saffron, rose water and kewra, and the distinctive dum (slow-steam) cooking method, Awadhi food represents centuries of culinary mastery. From the melt-in-the-mouth Galouti Kebab to the fragrant Dum Biryani, every dish tells a story of royalty, artistry and passion.
          </p>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setVegOnly(false)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!vegOnly ? 'bg-gold-500 text-navy-900' : 'glass gold-border text-white/60 hover:text-white'}`}>All Dishes</button>
          <button onClick={() => setVegOnly(true)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${vegOnly ? 'bg-green-500 text-white' : 'glass gold-border text-white/60 hover:text-white'}`}>🌱 Veg Only</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{foods.map((f, i) => <FoodCard key={f._id} food={f} i={i} />)}</div>
        )}
      </div>
    </div>
  );
}
