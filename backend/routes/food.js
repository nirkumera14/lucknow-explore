const express = require('express');
const router = express.Router();
const { getFoods, getFood, createFood } = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/auth');
router.get('/', getFoods);
router.get('/:id', getFood);
router.post('/', protect, authorize('admin'), createFood);
module.exports = router;
