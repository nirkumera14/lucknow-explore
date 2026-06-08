import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiWifi, FiCamera, FiExternalLink } from 'react-icons/fi';
import api from '../utils/api';
import { SkeletonCard } from '../components/common/SkeletonCard';

const CATEGORIES = [{ value: '', label: 'All' }, { value: 'luxury', label: '👑 Luxury' }, { value: 'mid-range', label: '🏨 Mid-Range' }, { value: 'budget', label: '💰 Budget' }, { value: 'boutique', label: '🌸 Boutique' }];

function HotelCard({ hotel, i }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
      className="glass rounded-2xl overflow-hidden gold-border hover:border-gold-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* ADD HOTEL IMAGE HERE */}
      <div className="relative h-52 bg-navy-700 flex items-center justify-center overflow-hidden">
        {hotel.thumbnailUrl && hotel.thumbnailUrl !== '/assets/placeholders/hotel-placeholder.jpg' ? (
          <img src={hotel.thumbnailUrl} alt={hotel.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-white/20">
            <FiCamera size={32} />
            <p className="text-xs">ADD HOTEL IMAGE</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-gold-500/90 text-navy-900 text-xs font-bold capitalize">{hotel.category}</span>
        </div>
        <div className="absolute top-3 right-3 flex gap-0.5 glass rounded-lg px-2 py-1">
          {[...Array(hotel.starRating || 3)].map((_, i) => <span key={i} className="text-gold-400 text-xs">★</span>)}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-lg text-white mb-1 line-clamp-1">{hotel.name}</h3>
        <p className="text-white/55 text-sm mb-3 line-clamp-2">{hotel.description}</p>
        <div className="flex items-center gap-1 text-white/50 text-sm mb-3">
          <FiMapPin size={12} className="text-gold-400" />
          <span>{hotel.location?.area || hotel.location?.address}</span>
        </div>
        {hotel.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hotel.amenities.slice(0, 4).map(a => (
              <span key={a} className="px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-xs border border-white/10">{a}</span>
            ))}
            {hotel.amenities.length > 4 && <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-xs border border-white/10">+{hotel.amenities.length - 4}</span>}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40">Starting from</p>
            <p className="text-gold-400 font-bold">₹{hotel.priceRange?.min?.toLocaleString()}<span className="text-white/40 font-normal text-sm">/night</span></p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <FiStar size={13} className="text-gold-400" fill="#c9a84c" />
              <span className="text-white font-semibold text-sm">{hotel.rating?.toFixed(1)}</span>
            </div>
            {hotel.contact?.website && (
              <a href={hotel.contact.website} target="_blank" rel="noreferrer" className="btn-gold text-xs px-4 py-2">Book Now</a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = category ? `?category=${category}` : '';
    api.get(`/hotels${params}`).then(({ data }) => { setHotels(data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title mb-2">🏨 Hotels in Lucknow</motion.h1>
        <p className="text-white/45 mb-8">From luxury 5-stars to comfortable budget stays</p>
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
        ) : hotels.length === 0 ? (
          <div className="text-center py-20 text-white/40"><p className="text-5xl mb-4">🏨</p><h3 className="font-display text-xl text-white mb-2">No hotels found</h3></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{hotels.map((h, i) => <HotelCard key={h._id} hotel={h} i={i} />)}</div>
        )}
      </div>
    </div>
  );
}
