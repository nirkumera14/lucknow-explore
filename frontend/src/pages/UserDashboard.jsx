import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiHeart, FiCamera, FiStar, FiUser, FiMapPin, FiEdit2 } from 'react-icons/fi';
import api from '../utils/api';

export default function UserDashboard() {
  const { user } = useSelector(s => s.auth);
  const [favorites, setFavorites] = useState([]);
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('favorites');

  useEffect(() => {
    Promise.all([api.get('/favorites'), api.get('/qr/history')])
      .then(([favRes, qrRes]) => { setFavorites(favRes.data.data); setScanHistory(qrRes.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Favorites', value: favorites.length, icon: '❤️' },
    { label: 'QR Scans', value: scanHistory.length, icon: '📱' },
    { label: 'Reviews', value: 0, icon: '⭐' },
    { label: 'Places Visited', value: user?.visitedPlaces?.length || 0, icon: '🗺️' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="glass rounded-3xl p-8 gold-border mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* ADD USER AVATAR HERE */}
            <div className="w-24 h-24 rounded-2xl bg-gold-500/20 border-2 border-gold-500/30 flex items-center justify-center text-3xl font-bold text-gold-400 overflow-hidden flex-shrink-0">
              {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-display text-3xl font-bold text-white mb-1">{user?.name}</h1>
              <p className="text-white/50 mb-2">{user?.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-white/50">
                <span className="flex items-center gap-1"><FiMapPin size={12} className="text-gold-400" />{user?.city || 'Lucknow'}</span>
                <span className="px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-400 text-xs border border-gold-500/20 capitalize">{user?.role}</span>
              </div>
            </div>
            <Link to="/dashboard/settings" className="glass rounded-xl px-4 py-2 text-sm text-white/60 hover:text-white flex items-center gap-2 border border-white/10">
              <FiEdit2 size={14} /> Edit Profile
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map(stat => (
            <div key={stat.label} className="glass rounded-2xl p-5 gold-border text-center">
              <p className="text-3xl mb-2">{stat.icon}</p>
              <p className="font-display font-bold text-2xl text-white">{stat.value}</p>
              <p className="text-white/50 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 glass rounded-2xl p-1 mb-6">
          {['favorites', 'scans'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-gold-500 text-navy-900' : 'text-white/60 hover:text-white'}`}>
              {tab === 'favorites' ? '❤️ Saved Places' : '📱 Scan History'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
          </div>
        ) : activeTab === 'favorites' ? (
          favorites.length === 0 ? (
            <div className="text-center py-16 glass rounded-2xl gold-border">
              <p className="text-5xl mb-4">💔</p>
              <h3 className="font-display text-xl text-white mb-2">No saved places yet</h3>
              <p className="text-white/45 mb-6">Heart any place to save it here</p>
              <Link to="/explore" className="btn-gold px-8">Explore Places</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favorites.map((place, i) => (
                <motion.div key={place._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/places/${place.slug}`} className="glass rounded-2xl overflow-hidden gold-border hover:border-gold-500/40 transition-all block hover:-translate-y-1">
                    {/* ADD FAVORITE PLACE IMAGE HERE */}
                    <div className="h-36 bg-navy-700 flex items-center justify-center overflow-hidden">
                      {place.thumbnailUrl && place.thumbnailUrl !== '/assets/placeholders/place-placeholder.jpg' ? (
                        <img src={place.thumbnailUrl} alt={place.name} className="w-full h-full object-cover" />
                      ) : <FiCamera className="text-white/20" size={24} />}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1">{place.name}</h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/45 text-xs">{place.location?.area}</span>
                        <div className="flex items-center gap-1">
                          <FiStar size={11} className="text-gold-400" fill="#c9a84c" />
                          <span className="text-white/70 text-xs">{place.rating?.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          scanHistory.length === 0 ? (
            <div className="text-center py-16 glass rounded-2xl gold-border">
              <p className="text-5xl mb-4">📱</p>
              <h3 className="font-display text-xl text-white mb-2">No QR scans yet</h3>
              <p className="text-white/45 mb-6">Scan QR codes at tourist spots</p>
              <Link to="/qr-scanner" className="btn-gold px-8">Open QR Scanner</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {scanHistory.map(scan => (
                <div key={scan._id} className="glass rounded-xl p-4 gold-border flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-navy-700 flex-shrink-0">
                    {scan.place?.thumbnailUrl ? <img src={scan.place.thumbnailUrl} alt="" className="w-full h-full object-cover" /> : <FiCamera className="text-white/20 m-auto mt-3" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{scan.place?.name}</p>
                    <p className="text-white/40 text-xs">{scan.place?.location?.area} · {new Date(scan.createdAt).toLocaleString()}</p>
                  </div>
                  <Link to={`/places/${scan.place?.slug}`} className="text-gold-400 hover:text-gold-300 text-sm">View →</Link>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
