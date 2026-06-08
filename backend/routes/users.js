const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Get all users (admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find({}).select('-password').sort('-createdAt').skip(skip).limit(parseInt(limit)),
      User.countDocuments()
    ]);
    res.json({ success: true, data: users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch users' }); }
});

// Toggle user active status (admin)
router.put('/:id/toggle-status', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (err) { res.status(500).json({ error: 'Failed to update user' }); }
});

module.exports = router;
