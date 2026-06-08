const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurant, createRestaurant } = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/auth');
router.get('/', getRestaurants);
router.get('/:id', getRestaurant);
router.post('/', protect, authorize('admin'), createRestaurant);
module.exports = router;
