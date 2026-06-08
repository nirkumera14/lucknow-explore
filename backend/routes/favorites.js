const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get user favorites
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'name slug thumbnailUrl rating category location.area entryFee timings');
    res.json({ success: true, data: user.favorites });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch favorites' }); }
});

module.exports = router;
