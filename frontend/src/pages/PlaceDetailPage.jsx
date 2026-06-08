import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlace, clearCurrent } from '../store/slices/placesSlice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FiMapPin, FiClock, FiDollarSign, FiHeart, FiShare2, FiStar,
         FiArrowLeft, FiCamera, FiQrCode, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api';

function StarRating({ rating, size = 16 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s <= Math.round(rating) ? '#c9a84c' : 'none'}
          stroke="#c9a84c" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

function ReviewForm({ placeId, onSuccess }) {
  const { isAuthenticated } = useSelector(s => s.auth);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) return (
    <div className="glass rounded-2xl p-6 text-center border border-white/10">
      <p className="text-white/60 mb-4">Login to write a review</p>
      <Link to="/login" className="btn-gold">Login</Link>
    </div>
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) { toast.error('Please write a comment'); return; }
    setLoading(true);
    try {
      await api.post(`/reviews/${placeId}`, { rating, title, comment });
      toast.success('Review added!');
      setComment(''); setTitle(''); setRating(5);
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add review');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="glass rounded-2xl p-6 border border-white/10 space-y-4">
      <h3 className="font-semibold text-white">Write a Review</h3>
      <div className="flex gap-2">
        {[1,2,3,4,5].map(s => (
          <button key={s} type="button" onClick={() => setRating(s)}
            className={`text-2xl transition-transform hover:scale-110 ${s <= rating ? 'text-gold-400' : 'text-white/20'}`}>★</button>
        ))}
        <span className="text-white/50 text-sm self-center ml-2">{rating}/5</span>
      </div>
      <input value={title} onChange={e => setTitle(e.target.value)}
        placeholder="Review title (optional)" className="input-dark text-sm" />
      <textarea value={comment} onChange={e => setComment(e.target.value)}
        placeholder="Share your experience..." rows={3}
        className="input-dark text-sm resize-none" required />
      <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-50">
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export default function PlaceDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: place, loading } = useSelector(s => s.places);
  const { isAuthenticated } = useSelector(s => s.auth);
  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    dispatch(fetchPlace(slug));
    return () => dispatch(clearCurrent());
  }, [slug, dispatch]);

  const handleFav = async () => {
    if (!isAuthenticated) { toast.error('Please login'); return; }
    try {
      const { data } = await api.post(`/places/${place._id}/favorite`);
      setIsFav(data.isFavorited);
      toast.success(data.message);
    } catch { toast.error('Failed'); }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: place?.name, url });
    else { navigator.clipboard.writeText(url); toast.success('Link copied!'); }
  };

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
    </div>
  );

  if (!place) return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">🏛️</div>
      <h2 className="font-display text-2xl text-white mb-4">Place not found</h2>
      <Link to="/explore" className="btn-gold">Back to Explore</Link>
    </div>
  );

  const lat = place.location?.coordinates?.lat;
  const lng = place.location?.coordinates?.lng;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/50 hover:text-gold-400 transition-colors mt-4 mb-6 text-sm">
          <FiArrowLeft /> Back
        </button>

        {/* Hero Image */}
        <div className="relative rounded-3xl overflow-hidden bg-navy-700 aspect-[16/6] mb-8">
          {/* ADD PLACE DETAIL IMAGE HERE */}
          {place.images?.[activeImg]?.url ? (
            <img src={place.images[activeImg].url} alt={place.name}
              className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
              <FiCamera size={56} className="mb-3" />
              <p className="text-sm">ADD PLACE IMAGE HERE</p>
              <p className="text-xs mt-1">Upload via Admin Panel → Places → {place.name}</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent" />

          {/* Actions overlay */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={handleFav}
              className={`w-10 h-10 rounded-xl backdrop-blur-sm flex items-center justify-center transition-all ${isFav ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-red-500/30'}`}>
              <FiHeart fill={isFav ? 'currentColor' : 'none'} />
            </button>
            <button onClick={handleShare}
              className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-sm text-white hover:text-gold-400 flex items-center justify-center transition-all">
              <FiShare2 />
            </button>
          </div>

          {/* Category + trending */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-xs text-white capitalize">{place.category}</span>
            {place.isTrending && <span className="px-3 py-1.5 rounded-full bg-gold-500/90 text-navy-900 text-xs font-semibold">🔥 Trending</span>}
          </div>

          {/* Image thumbnails */}
          {place.images?.length > 1 && (
            <div className="absolute bottom-4 left-4 flex gap-2">
              {place.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? 'border-gold-400' : 'border-white/20'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Main Info */}
          <div className="lg:col-span-2 space-y-8">

            {/* Title */}
            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">{place.name}</h1>
                <div className="flex items-center gap-2">
                  <StarRating rating={place.rating} />
                  <span className="text-gold-400 font-semibold">{place.rating?.toFixed(1)}</span>
                  <span className="text-white/40 text-sm">({place.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-white/50">
                <FiMapPin className="text-gold-500" />
                <span className="text-sm">{place.location?.address}</span>
              </div>
            </div>

            {/* Description */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h2 className="font-semibold text-white mb-3 flex items-center gap-2"><FiInfo /> About</h2>
              <p className="text-white/65 leading-relaxed text-sm">{place.description}</p>
            </div>

            {/* History */}
            {place.history && (
              <div className="glass rounded-2xl p-6 border border-white/5">
                <h2 className="font-semibold text-white mb-3">📜 History</h2>
                <p className="text-white/65 leading-relaxed text-sm">{place.history}</p>
              </div>
            )}

            {/* Tips */}
            {place.tips?.length > 0 && (
              <div className="glass rounded-2xl p-6 border border-white/5">
                <h2 className="font-semibold text-white mb-3">💡 Visitor Tips</h2>
                <ul className="space-y-2">
                  {place.tips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-sm text-white/65">
                      <span className="text-gold-400 mt-0.5">•</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Map */}
            {lat && lng && (
              <div className="glass rounded-2xl overflow-hidden border border-white/5">
                <div className="p-4 border-b border-white/5">
                  <h2 className="font-semibold text-white flex items-center gap-2"><FiMapPin /> Location</h2>
                </div>
                <MapContainer center={[lat, lng]} zoom={15} style={{ height: '300px' }} scrollWheelZoom={false}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker position={[lat, lng]}>
                    <Popup>{place.name}</Popup>
                  </Marker>
                </MapContainer>
                <div className="p-4">
                  <a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noopener noreferrer"
                    className="btn-outline-gold text-sm px-4 py-2">Open in Google Maps</a>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <h2 className="font-display text-2xl font-semibold text-white mb-6">Reviews</h2>
              <ReviewForm placeId={place._id} onSuccess={() => dispatch(fetchPlace(slug))} />
              <div className="mt-6 space-y-4">
                {place.reviews?.map(review => (
                  <div key={review._id} className="glass rounded-2xl p-5 border border-white/5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-sm font-bold text-gold-400">
                          {review.user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{review.user?.name}</p>
                          <p className="text-white/40 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} size={13} />
                    </div>
                    {review.title && <p className="font-semibold text-white/90 mt-3 text-sm">{review.title}</p>}
                    <p className="text-white/60 text-sm mt-2 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
                {(!place.reviews || place.reviews.length === 0) && (
                  <p className="text-white/30 text-sm text-center py-8">No reviews yet. Be the first!</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Info Card */}
          <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">

            {/* Quick Info */}
            <div className="glass rounded-2xl p-5 border border-white/10 space-y-4">
              <h3 className="font-semibold text-white">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 flex items-center gap-1.5"><FiClock size={13}/> Timings</span>
                  <span className="text-white font-medium">{place.timings?.open} – {place.timings?.close}</span>
                </div>
                {place.timings?.closedOn?.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Closed on</span>
                    <span className="text-white">{place.timings.closedOn.join(', ')}</span>
                  </div>
                )}
                <div className="border-t border-white/5 pt-3">
                  <p className="text-white/50 mb-2 text-xs uppercase tracking-wide">Entry Fee</p>
                  <div className="space-y-1">
                    <div className="flex justify-between"><span className="text-white/60">Indian</span><span className="text-gold-400 font-semibold">{place.entryFee?.indian === 0 ? 'Free' : `₹${place.entryFee?.indian}`}</span></div>
                    <div className="flex justify-between"><span className="text-white/60">Foreigner</span><span className="text-white">{place.entryFee?.foreigner === 0 ? 'Free' : `₹${place.entryFee?.foreigner}`}</span></div>
                    {place.entryFee?.child >= 0 && <div className="flex justify-between"><span className="text-white/60">Child</span><span className="text-white">{place.entryFee?.child === 0 ? 'Free' : `₹${place.entryFee?.child}`}</span></div>}
                  </div>
                  {place.entryFee?.notes && <p className="text-white/40 text-xs mt-2">{place.entryFee.notes}</p>}
                </div>
                {place.visitDuration && (
                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-white/50">Visit Duration</span>
                    <span className="text-white">{place.visitDuration}</span>
                  </div>
                )}
                {place.bestTimeToVisit && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Best Time</span>
                    <span className="text-white text-right max-w-[140px]">{place.bestTimeToVisit}</span>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code */}
            {place.qrCode && (
              <div className="glass rounded-2xl p-5 border border-white/10 text-center">
                <h3 className="font-semibold text-white mb-3 flex items-center justify-center gap-2"><FiQrCode /> QR Code</h3>
                <img src={place.qrCode} alt="QR Code" className="w-40 h-40 mx-auto rounded-xl" />
                <p className="text-white/40 text-xs mt-2">Scan to open this page</p>
                <a href={`/api/qr/download/${place._id}`}
                  className="btn-outline-gold text-xs px-4 py-2 mt-3 inline-block">Download QR</a>
              </div>
            )}

            {/* Tags */}
            {place.tags?.length > 0 && (
              <div className="glass rounded-2xl p-5 border border-white/10">
                <h3 className="font-semibold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {place.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-white/50 text-xs border border-white/10">#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby */}
            {place.nearbyAttractions?.length > 0 && (
              <div className="glass rounded-2xl p-5 border border-white/10">
                <h3 className="font-semibold text-white mb-3">Nearby Places</h3>
                <div className="space-y-2">
                  {place.nearbyAttractions.map((n, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-white/70">{n.name}</span>
                      <span className="text-white/40">{n.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
