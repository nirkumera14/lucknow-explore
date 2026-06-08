import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiMapPin, FiClock, FiStar, FiShare2, FiCamera } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../../store/slices/placesSlice';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const categoryColors = {
  historical: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  religious: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  shopping: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  entertainment: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  cultural: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  nature: 'bg-green-500/20 text-green-400 border-green-500/30',
  park: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  food: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function PlaceCard({ place, variant = 'default' }) {
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [isFav, setIsFav] = useState(user?.favorites?.includes(place._id));
  const [favCount, setFavCount] = useState(place.favoriteCount || 0);
  const [imgError, setImgError] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please login to save favorites'); return; }
    try {
      const result = await dispatch(toggleFavorite(place._id)).unwrap();
      setIsFav(result.isFavorited);
      setFavCount(result.favoriteCount);
      toast.success(result.message);
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/places/${place.slug}`;
    if (navigator.share) {
      navigator.share({ title: place.name, text: place.description?.substring(0, 100), url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link to={`/places/${place.slug}`} className="block">
        <div className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-gold-500/20 transition-all duration-300 shadow-card hover:shadow-card-hover">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-navy-700">
            {/* ADD PLACE IMAGE HERE */}
            {!imgError ? (
              <img
                src={place.thumbnailUrl || '/assets/placeholders/place-placeholder.jpg'}
                alt={place.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                <FiCamera size={32} className="mb-2" />
                <span className="text-xs">Add image for {place.name}</span>
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />

            {/* Category Badge */}
            <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full border font-medium ${categoryColors[place.category] || 'bg-white/10 text-white/80 border-white/20'}`}>
              {place.category}
            </span>

            {/* Trending */}
            {place.isTrending && (
              <span className="absolute top-3 right-14 text-xs px-2.5 py-1 rounded-full bg-gold-500/90 text-navy-900 font-semibold">
                🔥 Trending
              </span>
            )}

            {/* Action buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              <button
                onClick={handleFavorite}
                className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                  isFav ? 'bg-red-500 text-white' : 'bg-black/40 text-white/70 hover:text-red-400'
                }`}
              >
                <FiHeart size={13} fill={isFav ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-gold-400 flex items-center justify-center transition-all"
              >
                <FiShare2 size={13} />
              </button>
            </div>

            {/* Rating on image */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1 glass rounded-full px-2 py-1">
              <FiStar size={11} className="text-gold-400" fill="#c9a84c" />
              <span className="text-xs text-white font-semibold">{place.rating?.toFixed(1) || 'N/A'}</span>
              <span className="text-xs text-white/60">({place.reviewCount || 0})</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-display font-semibold text-lg text-white group-hover:text-gold-400 transition-colors line-clamp-1">
              {place.name}
            </h3>
            <p className="text-white/55 text-sm mt-1 line-clamp-2 leading-relaxed">
              {place.description}
            </p>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-white/50 text-xs">
                <FiMapPin size={11} className="text-gold-500" />
                <span>{place.location?.area || 'Lucknow'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/50 text-xs">
                <FiClock size={11} />
                <span>{place.timings?.open} – {place.timings?.close}</span>
              </div>
            </div>

            {/* Entry fee */}
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-white/40">Entry Fee</span>
              <span className="text-sm font-semibold text-gold-400">
                {place.entryFee?.indian === 0 ? 'Free' : `₹${place.entryFee?.indian}`}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
