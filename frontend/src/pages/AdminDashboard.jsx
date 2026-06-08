import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  FiHome, FiMapPin, FiCalendar, FiUsers, FiCamera,
  FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiDownload,
  FiBarChart2, FiSettings, FiLogOut, FiEye, FiStar,
  FiGrid, FiList, FiSearch, FiFilter
} from 'react-icons/fi';

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────
function AdminSidebar({ onClose }) {
  const links = [
    { to: '/admin', icon: FiHome, label: 'Overview', end: true },
    { to: '/admin/places', icon: FiMapPin, label: 'Places' },
    { to: '/admin/events', icon: FiCalendar, label: 'Events' },
    { to: '/admin/hotels', icon: FiGrid, label: 'Hotels' },
    { to: '/admin/restaurants', icon: FiList, label: 'Restaurants' },
    { to: '/admin/users', icon: FiUsers, label: 'Users' },
    { to: '/admin/qr', icon: FiCamera, label: 'QR Codes' },
    { to: '/admin/reviews', icon: FiStar, label: 'Reviews' },
  ];

  return (
    <aside className="w-64 glass-dark border-r border-white/5 min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
            <FiSettings className="text-navy-900" size={14} />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Admin Panel</p>
            <p className="text-white/40 text-xs">Lucknow Explore</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
                  : 'text-white/55 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5">
        <Link to="/home" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors px-3 py-2">
          <FiLogOut size={14} /> Back to Site
        </Link>
      </div>
    </aside>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, change, color = 'gold' }) {
  const colors = {
    gold: 'text-gold-400 bg-gold-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    green: 'text-green-400 bg-green-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
  };
  return (
    <div className="glass rounded-2xl p-5 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={18} />
        </div>
        {change && <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">{change}</span>}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-white/45 text-xs mt-1">{label}</p>
    </div>
  );
}

// ─── Overview Page ────────────────────────────────────────────────────────────
function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [placesRes, usersRes, qrRes] = await Promise.all([
          api.get('/places/stats'),
          api.get('/users?limit=1'),
          api.get('/qr/stats'),
        ]);
        setStats({
          places: placesRes.data.data,
          users: usersRes.data.pagination?.total || 0,
          qrScans: qrRes.data.data?.totalScans || 0,
        });
      } catch {
        toast.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-1">Dashboard Overview</h1>
        <p className="text-white/45 text-sm">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiMapPin} label="Total Places" value={stats?.places?.total || 0} color="gold" />
        <StatCard icon={FiUsers} label="Registered Users" value={stats?.users || 0} color="blue" />
        <StatCard icon={FiCamera} label="QR Scans" value={stats?.qrScans || 0} color="green" />
        <StatCard icon={FiStar} label="Avg Rating" value="4.4" color="purple" />
      </div>

      {/* Category Breakdown */}
      {stats?.places?.byCategory && (
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="font-semibold text-white mb-4">Places by Category</h2>
          <div className="space-y-3">
            {stats.places.byCategory.map(({ _id, count, avgRating }) => (
              <div key={_id} className="flex items-center gap-3">
                <span className="text-white/60 text-sm w-28 capitalize">{_id}</span>
                <div className="flex-1 bg-white/5 rounded-full h-2">
                  <div
                    className="bg-gold-500 h-2 rounded-full"
                    style={{ width: `${(count / stats.places.total) * 100}%` }}
                  />
                </div>
                <span className="text-white/60 text-xs w-8">{count}</span>
                <span className="text-gold-400 text-xs">⭐ {avgRating?.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: '/admin/places', icon: FiPlus, label: 'Add Place', color: 'bg-gold-500/15 text-gold-400' },
          { to: '/admin/events', icon: FiCalendar, label: 'Add Event', color: 'bg-blue-500/15 text-blue-400' },
          { to: '/admin/qr', icon: FiCamera, label: 'Generate QRs', color: 'bg-green-500/15 text-green-400' },
          { to: '/admin/users', icon: FiUsers, label: 'Manage Users', color: 'bg-purple-500/15 text-purple-400' },
        ].map(({ to, icon: Icon, label, color }) => (
          <Link key={label} to={to}
            className="glass rounded-2xl p-5 border border-white/5 flex flex-col items-center gap-3 hover:border-gold-500/20 transition-all group text-center"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={20} />
            </div>
            <span className="text-sm text-white/70 group-hover:text-white">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Places Manager ───────────────────────────────────────────────────────────
function AdminPlaces() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editPlace, setEditPlace] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', history: '', category: 'historical',
    'location.address': '', 'location.area': '',
    'location.coordinates.lat': '', 'location.coordinates.lng': '',
    'timings.open': '09:00', 'timings.close': '18:00',
    'entryFee.indian': 0, 'entryFee.foreigner': 0,
    tags: '', isTrending: false, isFeatured: false,
    bestTimeToVisit: '', visitDuration: '1-2 hours',
  });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/places?limit=50');
      setPlaces(data.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description,
        history: form.history,
        category: form.category,
        location: {
          address: form['location.address'],
          area: form['location.area'],
          coordinates: {
            lat: parseFloat(form['location.coordinates.lat']),
            lng: parseFloat(form['location.coordinates.lng']),
          }
        },
        timings: { open: form['timings.open'], close: form['timings.close'] },
        entryFee: { indian: parseInt(form['entryFee.indian']), foreigner: parseInt(form['entryFee.foreigner']) },
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        isTrending: form.isTrending,
        isFeatured: form.isFeatured,
        bestTimeToVisit: form.bestTimeToVisit,
        visitDuration: form.visitDuration,
      };
      if (editPlace) {
        await api.put(`/places/${editPlace._id}`, payload);
        toast.success('Place updated!');
      } else {
        await api.post('/places', payload);
        toast.success('Place created!');
      }
      setShowForm(false);
      setEditPlace(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this place?')) return;
    try {
      await api.delete(`/places/${id}`);
      toast.success('Place deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const handleGenerateQR = async (id) => {
    try {
      await api.post(`/qr/generate/${id}`);
      toast.success('QR generated!');
    } catch { toast.error('QR generation failed'); }
  };

  const filtered = places.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const openEdit = (place) => {
    setEditPlace(place);
    setForm({
      name: place.name, description: place.description, history: place.history || '',
      category: place.category,
      'location.address': place.location?.address || '',
      'location.area': place.location?.area || '',
      'location.coordinates.lat': place.location?.coordinates?.lat || '',
      'location.coordinates.lng': place.location?.coordinates?.lng || '',
      'timings.open': place.timings?.open || '09:00',
      'timings.close': place.timings?.close || '18:00',
      'entryFee.indian': place.entryFee?.indian || 0,
      'entryFee.foreigner': place.entryFee?.foreigner || 0,
      tags: (place.tags || []).join(', '),
      isTrending: place.isTrending || false,
      isFeatured: place.isFeatured || false,
      bestTimeToVisit: place.bestTimeToVisit || '',
      visitDuration: place.visitDuration || '1-2 hours',
    });
    setShowForm(true);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Manage Places</h1>
          <p className="text-white/40 text-sm mt-1">{places.length} places total</p>
        </div>
        <button onClick={() => { setEditPlace(null); setShowForm(true); setForm({ name:'',description:'',history:'',category:'historical','location.address':'','location.area':'','location.coordinates.lat':'','location.coordinates.lng':'','timings.open':'09:00','timings.close':'18:00','entryFee.indian':0,'entryFee.foreigner':0,tags:'',isTrending:false,isFeatured:false,bestTimeToVisit:'',visitDuration:'1-2 hours' }); }}
          className="btn-gold flex items-center gap-2 text-sm">
          <FiPlus size={14} /> Add Place
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search places..."
          className="input-dark pl-9 text-sm" />
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-gold-500/20 space-y-4">
          <h2 className="font-semibold text-white">{editPlace ? 'Edit Place' : 'Add New Place'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Place Name', required: true },
              { key: 'category', label: 'Category', type: 'select', options: ['historical','religious','shopping','entertainment','cultural','nature','park','food'] },
              { key: 'location.address', label: 'Full Address', required: true },
              { key: 'location.area', label: 'Area' },
              { key: 'location.coordinates.lat', label: 'Latitude', type: 'number' },
              { key: 'location.coordinates.lng', label: 'Longitude', type: 'number' },
              { key: 'timings.open', label: 'Opening Time', type: 'time' },
              { key: 'timings.close', label: 'Closing Time', type: 'time' },
              { key: 'entryFee.indian', label: 'Indian Entry Fee (₹)', type: 'number' },
              { key: 'entryFee.foreigner', label: 'Foreigner Fee (₹)', type: 'number' },
              { key: 'visitDuration', label: 'Visit Duration (e.g. 1-2 hours)' },
              { key: 'bestTimeToVisit', label: 'Best Time to Visit' },
              { key: 'tags', label: 'Tags (comma separated)' },
            ].map(({ key, label, type = 'text', options, required }) => (
              <div key={key}>
                <label className="block text-xs text-white/50 mb-1">{label}</label>
                {type === 'select' ? (
                  <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="input-dark text-sm">
                    {options.map(o => <option key={o} value={o} className="bg-navy-800">{o}</option>)}
                  </select>
                ) : (
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    required={required} className="input-dark text-sm" />
                )}
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-xs text-white/50 mb-1">Description *</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                required rows={3} className="input-dark text-sm resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-white/50 mb-1">History</label>
              <textarea value={form.history} onChange={e => setForm(f => ({ ...f, history: e.target.value }))}
                rows={3} className="input-dark text-sm resize-none" />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                <input type="checkbox" checked={form.isTrending} onChange={e => setForm(f => ({ ...f, isTrending: e.target.checked }))}
                  className="accent-gold-500" />
                Trending
              </label>
              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                  className="accent-gold-500" />
                Featured
              </label>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="btn-gold text-sm">{editPlace ? 'Update Place' : 'Create Place'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditPlace(null); }}
                className="btn-outline-gold text-sm">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Places Table */}
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
      ) : (
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5">
              <tr className="text-white/40 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Place</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3 hidden lg:table-cell">Rating</th>
                <th className="text-left px-5 py-3 hidden lg:table-cell">QR Scans</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(place => (
                <tr key={place._id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {/* ADD PLACE THUMBNAIL HERE */}
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/20 flex-shrink-0">
                        <FiMapPin size={12} />
                      </div>
                      <div>
                        <p className="text-white font-medium">{place.name}</p>
                        <p className="text-white/35 text-xs">{place.location?.area}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-xs px-2 py-1 rounded-full bg-gold-500/10 text-gold-400 capitalize">{place.category}</span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell text-white/60">⭐ {place.rating || 0}</td>
                  <td className="px-5 py-3 hidden lg:table-cell text-white/60">{place.qrScans || 0}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleGenerateQR(place._id)}
                        className="p-1.5 text-white/40 hover:text-green-400 transition-colors" title="Generate QR">
                        <FiCamera size={13} />
                      </button>
                      <button onClick={() => openEdit(place)}
                        className="p-1.5 text-white/40 hover:text-gold-400 transition-colors" title="Edit">
                        <FiEdit2 size={13} />
                      </button>
                      <button onClick={() => handleDelete(place._id)}
                        className="p-1.5 text-white/40 hover:text-red-400 transition-colors" title="Delete">
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── QR Manager ───────────────────────────────────────────────────────────────
function AdminQR() {
  const [places, setPlaces] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [placesRes, statsRes] = await Promise.all([
          api.get('/places?limit=50'),
          api.get('/qr/stats'),
        ]);
        setPlaces(placesRes.data.data);
        setStats(statsRes.data.data);
      } catch { toast.error('Failed to load'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const generateAll = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post('/qr/generate-all');
      toast.success(data.message);
    } catch { toast.error('Failed to generate QRs'); }
    finally { setGenerating(false); }
  };

  const downloadQR = (placeId) => {
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/qr/download/${placeId}`, '_blank');
  };

  const generateSingle = async (placeId) => {
    try {
      await api.post(`/qr/generate/${placeId}`);
      toast.success('QR generated!');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">QR Code Manager</h1>
          <p className="text-white/40 text-sm mt-1">Generate and manage QR codes for all tourist places</p>
        </div>
        <button onClick={generateAll} disabled={generating}
          className="btn-gold flex items-center gap-2 text-sm">
          {generating ? <FiRefreshCw size={14} className="animate-spin" /> : <FiCamera size={14} />}
          Generate All QRs
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={FiCamera} label="Total Scans" value={stats.totalScans} color="gold" />
          <StatCard icon={FiEye} label="Top Scanned" value={stats.topScanned?.[0]?.name || 'N/A'} color="blue" />
          <StatCard icon={FiBarChart2} label="Recent Scans" value={stats.recentScans?.length || 0} color="green" />
        </div>
      )}

      {/* Top scanned */}
      {stats?.topScanned && (
        <div className="glass rounded-2xl p-5 border border-white/5">
          <h3 className="font-semibold text-white mb-4">Top Scanned Places</h3>
          <div className="space-y-2">
            {stats.topScanned.map((place, i) => (
              <div key={place._id} className="flex items-center gap-3">
                <span className="text-white/30 text-sm w-5">{i + 1}.</span>
                <span className="text-white/70 text-sm flex-1">{place.name}</span>
                <span className="text-gold-400 text-sm font-semibold">{place.qrScans} scans</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR per place */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/5">
            <tr className="text-white/40 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3">Place</th>
              <th className="text-left px-5 py-3 hidden md:table-cell">QR Status</th>
              <th className="text-left px-5 py-3 hidden md:table-cell">Scans</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {places.map(place => (
              <tr key={place._id} className="hover:bg-white/2 transition-colors">
                <td className="px-5 py-3 text-white font-medium">{place.name}</td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    place.qrCode ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {place.qrCode ? '✓ Generated' : '✗ Not generated'}
                  </span>
                </td>
                <td className="px-5 py-3 hidden md:table-cell text-white/55">{place.qrScans || 0}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => generateSingle(place._id)}
                      className="text-xs px-3 py-1.5 bg-gold-500/10 text-gold-400 rounded-lg hover:bg-gold-500/20 transition-colors">
                      Generate
                    </button>
                    <button onClick={() => downloadQR(place._id)}
                      className="text-xs px-3 py-1.5 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1">
                      <FiDownload size={11} /> Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Users Manager ────────────────────────────────────────────────────────────
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/users?limit=50');
        setUsers(data.data);
        setTotal(data.pagination?.total || 0);
      } catch { toast.error('Failed to load users'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const toggleStatus = async (userId) => {
    try {
      const { data } = await api.put(`/users/${userId}/toggle-status`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: data.isActive } : u));
      toast.success(data.message);
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Manage Users</h1>
        <p className="text-white/40 text-sm mt-1">{total} registered users</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
      ) : (
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5">
              <tr className="text-white/40 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">User</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Role</th>
                <th className="text-left px-5 py-3 hidden lg:table-cell">Joined</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Status</th>
                <th className="text-right px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-white/2">
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-white/35 text-xs">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                      user.role === 'admin' ? 'bg-gold-500/15 text-gold-400' : 'bg-white/5 text-white/50'
                    }`}>{user.role}</span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell text-white/40 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>{user.isActive ? 'Active' : 'Disabled'}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => toggleStatus(user._id)}
                      className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                        user.isActive
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                      }`}>
                      {user.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Reviews Manager ──────────────────────────────────────────────────────────
function AdminReviews() {
  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-bold text-white mb-2">Manage Reviews</h1>
      <p className="text-white/40 text-sm mb-8">Moderate user reviews across all places</p>
      <div className="glass rounded-2xl p-8 border border-white/5 text-center">
        <FiStar size={40} className="text-gold-500/30 mx-auto mb-4" />
        <p className="text-white/50">Review management loaded per place via Place Detail page.</p>
        <Link to="/explore" className="btn-gold text-sm mt-4 inline-flex">Browse Places</Link>
      </div>
    </div>
  );
}

// ─── Events Manager (simple) ─────────────────────────────────────────────────
function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'cultural', 'venue.name': '', 'venue.address': '', startDate: '', endDate: '', timing: '', entryFee: 0, organizer: '' });

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/events'); setEvents(data.data); }
    catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', { ...form, venue: { name: form['venue.name'], address: form['venue.address'] } });
      toast.success('Event created!');
      setShowForm(false);
      load();
    } catch { toast.error('Failed to create'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete event?')) return;
    try { await api.delete(`/events/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Manage Events</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-gold text-sm flex items-center gap-2">
          <FiPlus size={14} /> Add Event
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 border border-gold-500/20">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'title', label: 'Title' },
              { key: 'category', label: 'Category', type: 'select', options: ['cultural','food','music','exhibition','festival','sports','religious'] },
              { key: 'venue.name', label: 'Venue Name' },
              { key: 'venue.address', label: 'Venue Address' },
              { key: 'startDate', label: 'Start Date', type: 'date' },
              { key: 'endDate', label: 'End Date', type: 'date' },
              { key: 'timing', label: 'Timing (e.g. 5:00 PM - 10:00 PM)' },
              { key: 'entryFee', label: 'Entry Fee (₹)', type: 'number' },
              { key: 'organizer', label: 'Organizer' },
            ].map(({ key, label, type = 'text', options }) => (
              <div key={key}>
                <label className="text-xs text-white/50 mb-1 block">{label}</label>
                {type === 'select' ? (
                  <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-dark text-sm">
                    {options.map(o => <option key={o} value={o} className="bg-navy-800">{o}</option>)}
                  </select>
                ) : (
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-dark text-sm" />
                )}
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="text-xs text-white/50 mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="input-dark text-sm resize-none" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-gold text-sm">Create Event</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline-gold text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)
        ) : events.map(event => (
          <div key={event._id} className="glass rounded-xl p-4 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{event.title}</p>
              <p className="text-white/40 text-xs mt-0.5">{new Date(event.startDate).toLocaleDateString()} • {event.venue?.name} • ₹{event.entryFee}</p>
            </div>
            <button onClick={() => handleDelete(event._id)} className="p-2 text-white/30 hover:text-red-400 transition-colors">
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Hotels / Restaurants Manager (placeholder) ───────────────────────────────
function AdminHotels() {
  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-bold text-white mb-2">Manage Hotels</h1>
      <div className="glass rounded-2xl p-8 border border-white/5 text-center mt-8">
        <FiGrid size={40} className="text-gold-500/30 mx-auto mb-4" />
        <p className="text-white/50 mb-2">Hotel management works via API.</p>
        <p className="text-white/30 text-sm">Use POST /api/hotels to add hotels programmatically or via the seed data.</p>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex pt-16">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="places" element={<AdminPlaces />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="hotels" element={<AdminHotels />} />
          <Route path="restaurants" element={<AdminHotels />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="qr" element={<AdminQR />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Routes>
      </main>
    </div>
  );
}
