import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchPlaces, setFilters } from '../store/slices/placesSlice';
import PlaceCard from '../components/places/PlaceCard';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { FiSearch, FiFilter, FiX, FiGrid, FiList } from 'react-icons/fi';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'historical', label: '🏛️ Historical' },
  { value: 'religious', label: '🕌 Religious' },
  { value: 'shopping', label: '🛍️ Shopping' },
  { value: 'entertainment', label: '🎢 Entertainment' },
  { value: 'cultural', label: '🎭 Cultural' },
  { value: 'nature', label: '🌿 Nature' },
  { value: 'park', label: '🌳 Park' },
];

const SORTS = [
  { value: '-rating', label: 'Top Rated' },
  { value: '-favoriteCount', label: 'Most Loved' },
  { value: '-reviewCount', label: 'Most Reviewed' },
  { value: '-qrScans', label: 'Most Visited' },
  { value: 'name', label: 'A–Z' },
];

export default function ExplorePage() {
  const dispatch = useDispatch();
  const { list, loading, pagination } = useSelector(s => s.places);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('-rating');
  const [page, setPage] = useState(1);
  const [trending, setTrending] = useState(searchParams.get('trending') === 'true');

  const load = useCallback(() => {
    const params = { page, limit: 12, sort };
    if (category) params.category = category;
    if (search.trim()) params.search = search.trim();
    if (trending) params.trending = true;
    dispatch(fetchPlaces(params));
  }, [dispatch, page, sort, category, search, trending]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
    setTrending(false);
  };

  const clearFilters = () => {
    setSearch(''); setCategory(''); setSort('-rating');
    setPage(1); setTrending(false);
  };

  const hasFilters = search || category || trending || sort !== '-rating';

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="py-10">
          <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="section-title mb-2">🏛️ Explore Lucknow</motion.h1>
          <p className="text-white/50">Discover {pagination?.total || '10+'} incredible places in the City of Nawabs</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search places, landmarks, areas..."
              className="input-dark pl-11 h-12 text-sm"
            />
          </div>
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            className="input-dark w-40 h-12 text-sm cursor-pointer"
          >
            {SORTS.map(s => <option key={s.value} value={s.value} className="bg-navy-800">{s.label}</option>)}
          </select>
          <button type="submit" className="btn-gold h-12 px-5">Search</button>
        </form>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleCategory(value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                category === value
                  ? 'bg-gold-500 text-navy-900'
                  : 'glass border border-white/10 text-white/70 hover:border-gold-500/30 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
          {trending && (
            <button
              onClick={() => setTrending(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1"
            >
              🔥 Trending <FiX size={12} className="ml-1" onClick={() => setTrending(false)} />
            </button>
          )}
          {hasFilters && (
            <button onClick={clearFilters}
              className="px-4 py-2 rounded-xl text-sm text-white/40 hover:text-red-400 flex items-center gap-1 transition-colors">
              <FiX size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* Results count */}
        {pagination && (
          <p className="text-white/40 text-sm mb-6">
            {pagination.total} place{pagination.total !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-xl text-white mb-2">No places found</h3>
            <p className="text-white/40 mb-6">Try different search terms or filters</p>
            <button onClick={clearFilters} className="btn-gold">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {list.map((place, i) => (
                <motion.div key={place._id}
                  initial={{ opacity:0, y:20 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.04 }}>
                  <PlaceCard place={place} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl glass border border-white/10 text-white/60 disabled:opacity-30 hover:border-gold-500/30 transition-all"
            >← Prev</button>
            {[...Array(pagination.pages)].map((_, i) => (
              <button key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                  page === i+1 ? 'bg-gold-500 text-navy-900' : 'glass border border-white/10 text-white/60 hover:border-gold-500/30'
                }`}>
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-4 py-2 rounded-xl glass border border-white/10 text-white/60 disabled:opacity-30 hover:border-gold-500/30 transition-all"
            >Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
