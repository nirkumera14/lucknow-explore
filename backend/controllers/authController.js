const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { validationResult } = require('express-validator');

// ─── Register ────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const user = await User.create({ name, email, password, phone });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        city: user.city
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account has been deactivated. Contact support.' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        city: user.city,
        favorites: user.favorites
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// ─── Get Current User ─────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'name slug thumbnailUrl rating location.area');

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ─── Update Profile ───────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'bio', 'city'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (req.file) {
      // ADD AVATAR UPLOAD HANDLING HERE
      // updates.avatar = `/uploads/avatars/${req.file.filename}`;
      updates.avatar = req.file ? `/uploads/avatars/${req.file.filename}` : undefined;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, message: 'Profile updated successfully!', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error during profile update' });
  }
};

// ─── Change Password ─────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ─── Logout (client-side token removal) ─────────────────────────────────────
exports.logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
