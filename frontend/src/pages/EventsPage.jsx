import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiClock, FiCamera, FiFilter } from 'react-icons/fi';
import api from '../utils/api';
import { SkeletonCard } from '../components/common/SkeletonCard';

const CATS = ['','cultural','food','music','exhibition','festival','sports','religious'];

function EventCard({ event }) {
  return (
    <motion.div whileHover={{ y:-4 }} className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-gold-500/20 transition-all duration-300">
      {/* ADD EVENT BANNER IMAGE HERE */}
      <div className="relative h-48 bg-navy-700">
        {event.bannerUrl && event.bannerUrl !== '/assets/placeholders/event-placeholder.jpg' ? (
          <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
            <FiCamera size={32} className="mb-1" />
            <span className="text-xs">ADD EVENT BANNER HERE</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            event.isFeatured ? 'bg-gold-500 text-navy-900' : 'bg-white/10 text-white'
          }`}>{event.isFeatured ? '⭐ Featured' : event.category}</span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="glass px-2 py-1 rounded-lg text-xs text-gold-400 font-medium">
            {event.entryFee === 0 ? 'Free Entry' : `₹${event.entryFee}`}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display font-semibold text-lg text-white line-clamp-1 mb-1">{event.title}</h3>
        <p className="text-white/50 text-sm line-clamp-2 mb-4">{event.description}</p>
        <div className="space-y-2 text-xs text-white/50">
          <div className="flex items-center gap-2"><FiCalendar className="text-gold-500" />
            <span>{new Date(event.startDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
            {event.endDate !== event.startDate && ` – ${new Date(event.endDate).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}`}</span>
          </div>
          {event.timing && <div className="flex items-center gap-2"><FiClock className="text-gold-500" /><span>{event.timing}</span></div>}
          <div className="flex items-center gap-2"><FiMapPin className="text-gold-500" /><span>{event.venue?.name}</span></div>
        </div>
        {event.registrationUrl && (
          <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer"
            className="btn-gold w-full text-center text-sm mt-4 block">Register Now</a>
        )}
      </div>
    </motion.div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('');
  const [upcoming, setUpcoming] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat) params.append('category', cat);
      if (upcoming) params.append('upcoming', 'true');
      const { data } = await api.get(`/events?${params}`);
      setEvents(data.data);
    } catch { setEvents([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [cat, upcoming]);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="py-10">
          <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="section-title mb-2">🎭 Events in Lucknow</motion.h1>
          <p className="text-white/50">Festivals, cultural shows, food fairs and more</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button onClick={() => setUpcoming(!upcoming)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${upcoming ? 'bg-gold-500 text-navy-900' : 'glass border border-white/10 text-white/70 hover:border-gold-500/30'}`}>
            📅 Upcoming Only
          </button>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${cat === c ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' : 'glass border border-white/10 text-white/70 hover:border-gold-500/30'}`}>
              {c || 'All'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_,i) => <SkeletonCard key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="font-display text-xl text-white mb-2">No events found</h3>
            <p className="text-white/40">Check back soon for upcoming events</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev, i) => (
              <motion.div key={ev._id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}>
                <EventCard event={ev} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
