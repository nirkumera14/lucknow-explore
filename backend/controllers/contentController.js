const { Event, Hotel, Restaurant, Food } = require('../models/index');

// ════════════════════════════════════════════════════════════════
// EVENTS CONTROLLER
// ════════════════════════════════════════════════════════════════

exports.getEvents = async (req, res) => {
  try {
    const { category, upcoming, page = 1, limit = 9 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (upcoming === 'true') query.startDate = { $gte: new Date() };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [events, total] = await Promise.all([
      Event.find(query).sort({ isFeatured: -1, startDate: 1 }).skip(skip).limit(parseInt(limit)),
      Event.countDocuments(query)
    ]);
    res.json({ success: true, data: events, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch events' }); }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch event' }); }
};

exports.createEvent = async (req, res) => {
  try {
    const eventData = { ...req.body, createdBy: req.user._id };
    if (req.file) eventData.bannerUrl = `/uploads/events/${req.file.filename}`;
    const event = await Event.create(eventData);
    res.status(201).json({ success: true, message: 'Event created!', data: event });
  } catch (err) { res.status(500).json({ error: 'Failed to create event' }); }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (err) { res.status(500).json({ error: 'Failed to update event' }); }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) { res.status(500).json({ error: 'Failed to delete event' }); }
};

// ════════════════════════════════════════════════════════════════
// HOTELS CONTROLLER
// ════════════════════════════════════════════════════════════════

exports.getHotels = async (req, res) => {
  try {
    const { category, minRating, page = 1, limit = 9 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (minRating) query.rating = { $gte: parseFloat(minRating) };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [hotels, total] = await Promise.all([
      Hotel.find(query).sort({ isFeatured: -1, rating: -1 }).skip(skip).limit(parseInt(limit)),
      Hotel.countDocuments(query)
    ]);
    res.json({ success: true, data: hotels, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch hotels' }); }
};

exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
    res.json({ success: true, data: hotel });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch hotel' }); }
};

exports.createHotel = async (req, res) => {
  try {
    if (req.file) req.body.thumbnailUrl = `/uploads/hotels/${req.file.filename}`;
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, message: 'Hotel added!', data: hotel });
  } catch (err) { res.status(500).json({ error: 'Failed to create hotel' }); }
};

exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
    res.json({ success: true, data: hotel });
  } catch (err) { res.status(500).json({ error: 'Failed to update hotel' }); }
};

// ════════════════════════════════════════════════════════════════
// RESTAURANTS CONTROLLER
// ════════════════════════════════════════════════════════════════

exports.getRestaurants = async (req, res) => {
  try {
    const { category, cuisine, page = 1, limit = 9 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (cuisine) query.cuisine = { $in: [cuisine] };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [restaurants, total] = await Promise.all([
      Restaurant.find(query).sort({ isFeatured: -1, rating: -1 }).skip(skip).limit(parseInt(limit)),
      Restaurant.countDocuments(query)
    ]);
    res.json({ success: true, data: restaurants, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch restaurants' }); }
};

exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json({ success: true, data: restaurant });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch restaurant' }); }
};

exports.createRestaurant = async (req, res) => {
  try {
    if (req.file) req.body.thumbnailUrl = `/uploads/restaurants/${req.file.filename}`;
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({ success: true, message: 'Restaurant added!', data: restaurant });
  } catch (err) { res.status(500).json({ error: 'Failed to create restaurant' }); }
};

// ════════════════════════════════════════════════════════════════
// FOOD CONTROLLER
// ════════════════════════════════════════════════════════════════

exports.getFoods = async (req, res) => {
  try {
    const { category, isVegetarian } = req.query;
    const query = {};
    if (category) query.category = category;
    if (isVegetarian !== undefined) query.isVegetarian = isVegetarian === 'true';

    const foods = await Food.find(query).sort({ isFeatured: -1 });
    res.json({ success: true, data: foods });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch foods' }); }
};

exports.getFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ error: 'Food not found' });
    res.json({ success: true, data: food });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch food' }); }
};

exports.createFood = async (req, res) => {
  try {
    if (req.file) req.body.imageUrl = `/uploads/food/${req.file.filename}`;
    const food = await Food.create(req.body);
    res.status(201).json({ success: true, data: food });
  } catch (err) { res.status(500).json({ error: 'Failed to create food item' }); }
};
