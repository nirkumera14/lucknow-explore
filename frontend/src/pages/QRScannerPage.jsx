import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCamera, FiCheckCircle, FiClock, FiX } from 'react-icons/fi';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

export default function QRScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const scannerRef = useRef(null);
  const html5QrcodeRef = useRef(null);
  const { isAuthenticated } = useSelector(s => s.auth);

  useEffect(() => {
    if (isAuthenticated) {
      setLoadingHistory(true);
      api.get('/qr/history').then(({ data }) => { setHistory(data.data); setLoadingHistory(false); }).catch(() => setLoadingHistory(false));
    }
  }, [isAuthenticated, result]);

  const startScanner = async () => {
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      html5QrcodeRef.current = new Html5Qrcode('qr-reader');
      setScanning(true);
      await html5QrcodeRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await stopScanner();
          handleQRResult(decodedText);
        },
        () => {}
      );
    } catch (err) {
      toast.error('Camera access denied. Please allow camera permission.');
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrcodeRef.current) {
      try { await html5QrcodeRef.current.stop(); } catch {}
      html5QrcodeRef.current = null;
    }
    setScanning(false);
  };

  const handleQRResult = async (text) => {
    try {
      // Extract slug from URL
      const url = new URL(text);
      const slug = url.pathname.split('/places/')[1]?.split('?')[0];
      if (!slug) { toast.error('Invalid QR code'); return; }
      const { data } = await api.post('/qr/scan', { placeSlug: slug });
      setResult(data.data);
      toast.success(data.message);
    } catch {
      toast.error('Invalid QR code or place not found');
    }
  };

  useEffect(() => { return () => { if (html5QrcodeRef.current) { html5QrcodeRef.current.stop().catch(() => {}); } }; }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title mb-2 text-center">📱 QR Scanner</h1>
          <p className="text-white/45 text-center mb-10">Scan QR codes at tourist spots for instant information</p>
        </motion.div>

        {/* Scanner Area */}
        {result ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-8 gold-border text-center">
            <FiCheckCircle className="text-green-400 text-5xl mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-white mb-2">Place Identified!</h2>
            <div className="glass rounded-xl p-5 my-5 text-left">
              <div className="flex items-center gap-4">
                {/* ADD PLACE THUMBNAIL HERE */}
                <div className="w-16 h-16 rounded-xl bg-navy-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {result.place.thumbnailUrl ? (
                    <img src={result.place.thumbnailUrl} alt={result.place.name} className="w-full h-full object-cover" />
                  ) : <FiCamera className="text-white/30" />}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{result.place.name}</h3>
                  <p className="text-white/50 text-sm capitalize">{result.place.category}</p>
                  <p className="text-white/60 text-sm mt-1 line-clamp-2">{result.place.description}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Link to={`/places/${result.place.slug}`} className="btn-gold px-8">View Full Details →</Link>
              <button onClick={() => setResult(null)} className="btn-outline-gold px-6">Scan Another</button>
            </div>
          </motion.div>
        ) : (
          <div className="glass rounded-2xl p-6 gold-border text-center">
            {scanning ? (
              <>
                <div id="qr-reader" className="w-full rounded-xl overflow-hidden" />
                <button onClick={stopScanner} className="mt-4 btn-outline-gold flex items-center gap-2 mx-auto">
                  <FiX /> Stop Scanner
                </button>
              </>
            ) : (
              <div className="py-8">
                <div className="w-40 h-40 mx-auto mb-6 rounded-2xl glass gold-border flex items-center justify-center animate-pulse-gold">
                  <span className="text-7xl">📷</span>
                </div>
                <h3 className="font-display text-xl text-white mb-2">Ready to Scan</h3>
                <p className="text-white/50 text-sm mb-6 max-w-xs mx-auto">Point your camera at a QR code displayed at any Lucknow tourist spot</p>
                <button onClick={startScanner} className="btn-gold px-10 py-4 text-base flex items-center gap-2 mx-auto">
                  <FiCamera size={18} /> Start Camera Scanner
                </button>
              </div>
            )}
          </div>
        )}

        {/* How to use */}
        <div className="mt-8 glass rounded-2xl p-6 gold-border">
          <h3 className="font-semibold text-white mb-4">How QR Smart Tourism Works</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[{ step: '1', icon: '🗺️', text: 'Visit a tourist spot' }, { step: '2', icon: '📱', text: 'Scan the QR code' }, { step: '3', icon: '✨', text: 'Get instant info' }].map(s => (
              <div key={s.step}>
                <div className="w-10 h-10 rounded-full bg-gold-500/20 text-gold-400 font-bold flex items-center justify-center mx-auto mb-2">{s.step}</div>
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="text-white/55 text-xs">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scan History */}
        {isAuthenticated && (
          <div className="mt-8">
            <h3 className="font-display text-xl font-semibold text-white mb-4 flex items-center gap-2"><FiClock className="text-gold-400" /> Scan History</h3>
            {loadingHistory ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-white/40 glass rounded-xl gold-border">No scans yet. Start exploring!</div>
            ) : (
              <div className="space-y-3">
                {history.map(scan => (
                  <div key={scan._id} className="glass rounded-xl p-4 gold-border flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {scan.place?.thumbnailUrl ? <img src={scan.place.thumbnailUrl} alt="" className="w-full h-full object-cover" /> : <FiCamera className="text-gold-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{scan.place?.name}</p>
                      <p className="text-white/40 text-xs">{scan.place?.location?.area} · {new Date(scan.createdAt).toLocaleString()}</p>
                    </div>
                    <Link to={`/places/${scan.place?.slug}`} className="text-gold-400 hover:text-gold-300 text-xs flex-shrink-0">View →</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
