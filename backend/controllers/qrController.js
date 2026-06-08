const QRCode = require('qrcode');
const Place = require('../models/Place');
const { QRScan } = require('../models/index');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─── Generate QR Code for a Place ────────────────────────────────────────────
exports.generateQR = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ error: 'Place not found' });

    const qrUrl = `${FRONTEND_URL}/places/${place.slug}?qr=true`;

    const qrOptions = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#FFFFFF' },
      width: 300
    };

    const qrDataUrl = await QRCode.toDataURL(qrUrl, qrOptions);

    // Save QR to place record
    place.qrCode = qrDataUrl;
    await place.save({ validateBeforeSave: false });

    res.json({
      success: true,
      data: {
        qrCode: qrDataUrl,
        url: qrUrl,
        placeName: place.name,
        placeSlug: place.slug
      }
    });
  } catch (err) {
    console.error('QR generation error:', err);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};

// ─── Generate QR for All Places (bulk) ───────────────────────────────────────
exports.generateAllQRs = async (req, res) => {
  try {
    const places = await Place.find({ isActive: true, qrCode: null });

    const results = [];
    for (const place of places) {
      try {
        const qrUrl = `${FRONTEND_URL}/places/${place.slug}?qr=true`;
        const qrDataUrl = await QRCode.toDataURL(qrUrl, { width: 300, margin: 2 });
        place.qrCode = qrDataUrl;
        await place.save({ validateBeforeSave: false });
        results.push({ place: place.name, status: 'generated' });
      } catch (err) {
        results.push({ place: place.name, status: 'failed' });
      }
    }

    res.json({ success: true, message: `QR codes generated for ${results.length} places`, data: results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR codes' });
  }
};

// ─── Record QR Scan ───────────────────────────────────────────────────────────
exports.recordScan = async (req, res) => {
  try {
    const { placeSlug, placeId } = req.body;

    let place;
    if (placeId) {
      place = await Place.findById(placeId);
    } else if (placeSlug) {
      place = await Place.findOne({ slug: placeSlug });
    }

    if (!place) return res.status(404).json({ error: 'Place not found' });

    // Increment scan count
    place.qrScans += 1;
    await place.save({ validateBeforeSave: false });

    // Record scan in history
    const scanRecord = await QRScan.create({
      user: req.user?._id || null,
      place: place._id,
      deviceInfo: req.headers['user-agent'],
      ipAddress: req.ip,
      location: req.body.location || null
    });

    // Add to user's scan history if logged in
    if (req.user) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { qrScans: scanRecord._id, visitedPlaces: place._id }
      });
    }

    res.json({
      success: true,
      message: `Welcome to ${place.name}!`,
      data: {
        place: {
          _id: place._id,
          name: place.name,
          slug: place.slug,
          thumbnailUrl: place.thumbnailUrl,
          category: place.category,
          description: place.description.substring(0, 200) + '...'
        },
        scanId: scanRecord._id
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record scan' });
  }
};

// ─── Get User's QR Scan History ───────────────────────────────────────────────
exports.getScanHistory = async (req, res) => {
  try {
    const scans = await QRScan.find({ user: req.user._id })
      .populate('place', 'name slug thumbnailUrl category location.area')
      .sort('-createdAt')
      .limit(50);

    res.json({ success: true, data: scans });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scan history' });
  }
};

// ─── Get QR Stats (Admin) ─────────────────────────────────────────────────────
exports.getQRStats = async (req, res) => {
  try {
    const [totalScans, topScanned, recentScans] = await Promise.all([
      QRScan.countDocuments(),
      Place.find({ isActive: true }).select('name qrScans thumbnailUrl').sort('-qrScans').limit(5),
      QRScan.find().populate('place', 'name').populate('user', 'name').sort('-createdAt').limit(10)
    ]);

    res.json({ success: true, data: { totalScans, topScanned, recentScans } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch QR stats' });
  }
};

// ─── Download QR as PNG ───────────────────────────────────────────────────────
exports.downloadQR = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).select('name slug qrCode');
    if (!place) return res.status(404).json({ error: 'Place not found' });

    if (!place.qrCode) {
      return res.status(404).json({ error: 'QR code not generated yet. Generate it first.' });
    }

    const base64Data = place.qrCode.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="qr-${place.slug}.png"`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to download QR code' });
  }
};
