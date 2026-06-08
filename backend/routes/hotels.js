// routes/hotels.js
const express = require('express');
const router = express.Router();
const { getHotels, getHotel, createHotel, updateHotel } = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/auth');
router.get('/', getHotels);
router.get('/:id', getHotel);
router.post('/', protect, authorize('admin'), createHotel);
router.put('/:id', protect, authorize('admin'), updateHotel);
module.exports = router;
