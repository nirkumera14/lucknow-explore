require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Place = require('../models/Place');
const { Event, Hotel, Restaurant, Food } = require('../models/index');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lucknow-explore';

const placesData = [
  {
    name: 'Bara Imambara',
    slug: 'bara-imambara',
    description: 'Bara Imambara is a magnificent imambara complex built by Asaf-ud-Daula, the Nawab of Awadh, in 1784. It is one of the most remarkable examples of Mughal architecture in India, featuring a central hall with no beam support — one of the largest arched constructions in the world.',
    history: 'Built during a famine in 1784 by Nawab Asaf-ud-Daula to provide employment to people. The construction employed thousands of laborers. The bhul-bhulaiya (labyrinth) on the upper floors is a famous maze that confuses even locals. The complex includes a mosque, baoli (step well), and several gateways.',
    category: 'historical',
    // ADD PLACE IMAGE HERE: /uploads/places/bara-imambara.jpg (1200x800px recommended)
    thumbnailUrl: '/assets/placeholders/place-placeholder.jpg',
    images: [{ url: '/assets/placeholders/place-placeholder.jpg', caption: 'Bara Imambara - Main View', isPrimary: true }],
    location: {
      address: 'Husainabad, Lucknow, Uttar Pradesh 226003',
      area: 'Husainabad',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226003',
      coordinates: { lat: 26.8742, lng: 80.9121 }
    },
    timings: { open: '06:00', close: '17:00', closedOn: [], notes: 'Closed on public holidays' },
    entryFee: { indian: 25, foreigner: 500, child: 10, notes: 'Camera fee: ₹25 extra' },
    rating: 4.5,
    reviewCount: 1240,
    tags: ['mughal', 'imambara', 'heritage', 'architecture', 'labyrinth'],
    isTrending: true,
    isFeatured: true,
    visitDuration: '2-3 hours',
    bestTimeToVisit: 'October to March',
    tips: ['Hire a local guide for the labyrinth', 'Visit early morning to avoid crowds', 'Photography allowed in most areas'],
    qrScans: 0,
    favoriteCount: 342
  },
  {
    name: 'Chota Imambara',
    slug: 'chota-imambara',
    description: 'Also known as Imambara Hussainabad Mubarak or the Palace of Lights, Chota Imambara was built by Muhammad Ali Shah in 1838. It serves as a mausoleum and is renowned for its golden dome and beautiful chandeliers imported from Belgium.',
    history: 'Built by Muhammad Ali Shah, the third Nawab of Awadh, in 1838. The imambara houses the tombs of Muhammad Ali Shah and his mother. Its spectacular illumination during Muharram earned it the nickname "Palace of Lights".',
    category: 'religious',
    thumbnailUrl: '/assets/placeholders/place-placeholder.jpg',
    images: [{ url: '/assets/placeholders/place-placeholder.jpg', caption: 'Chota Imambara - Golden Dome', isPrimary: true }],
    location: {
      address: 'Hussainabad, Lucknow, Uttar Pradesh 226003',
      area: 'Hussainabad',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226003',
      coordinates: { lat: 26.8749, lng: 80.9094 }
    },
    timings: { open: '06:00', close: '17:00', closedOn: [] },
    entryFee: { indian: 25, foreigner: 300, child: 10 },
    rating: 4.4,
    reviewCount: 890,
    tags: ['imambara', 'religious', 'nawab', 'mughal', 'heritage'],
    isTrending: true,
    isFeatured: true,
    visitDuration: '1-2 hours',
    bestTimeToVisit: 'October to February',
    tips: ['Visit during Muharram for spectacular lighting', 'Modest dress required'],
    favoriteCount: 245
  },
  {
    name: 'Rumi Darwaza',
    slug: 'rumi-darwaza',
    description: 'Rumi Darwaza, also known as the Turkish Gate, is a massive 60-foot-tall ornamental gateway built in 1784. It is considered one of the finest examples of Awadhi architecture and is often used as an emblem of Lucknow.',
    history: 'Built by Nawab Asaf-ud-Daula in 1784, the same year as Bara Imambara. The gateway was built as part of a famine relief project. Its design is said to be inspired by the Sublime Porte in Istanbul (Constantinople), hence the name "Rumi" (Roman/Byzantine).',
    category: 'historical',
    thumbnailUrl: '/assets/placeholders/place-placeholder.jpg',
    images: [{ url: '/assets/placeholders/place-placeholder.jpg', caption: 'Rumi Darwaza - The Turkish Gate', isPrimary: true }],
    location: {
      address: 'Husainabad, Lucknow, Uttar Pradesh 226003',
      area: 'Husainabad',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226003',
      coordinates: { lat: 26.8736, lng: 80.9109 }
    },
    timings: { open: '00:00', close: '23:59', notes: 'Open 24 hours, best viewed at night when lit' },
    entryFee: { indian: 0, foreigner: 0, notes: 'Free entry' },
    rating: 4.6,
    reviewCount: 1560,
    tags: ['gateway', 'awadhi', 'architecture', 'landmark', 'heritage'],
    isTrending: true,
    isFeatured: true,
    visitDuration: '30-45 minutes',
    bestTimeToVisit: 'Evening for light and sound',
    tips: ['Best photographed at dusk', 'Night illumination is spectacular', 'Part of a walking tour with Bara Imambara'],
    favoriteCount: 520
  },
  {
    name: 'Hazratganj',
    slug: 'hazratganj',
    description: 'Hazratganj is the main shopping street and social hub of Lucknow. Known as "The Oxford Street of Lucknow", it offers a blend of colonial architecture, upscale shops, restaurants, and the cultural heartbeat of the city.',
    history: 'Developed during the British Raj era in the 19th century, Hazratganj was named after Nawab Hazrat Mahal. The area retains its colonial-era charm with Victorian buildings alongside modern shops and eateries.',
    category: 'shopping',
    thumbnailUrl: '/assets/placeholders/place-placeholder.jpg',
    images: [{ url: '/assets/placeholders/place-placeholder.jpg', caption: 'Hazratganj - The Heart of Lucknow', isPrimary: true }],
    location: {
      address: 'Hazratganj, Lucknow, Uttar Pradesh 226001',
      area: 'Hazratganj',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226001',
      coordinates: { lat: 26.8488, lng: 80.9478 }
    },
    timings: { open: '10:00', close: '22:00', notes: 'Shops vary; street is always accessible' },
    entryFee: { indian: 0, foreigner: 0, notes: 'Free' },
    rating: 4.3,
    reviewCount: 2100,
    tags: ['shopping', 'food', 'colonial', 'market', 'culture'],
    isTrending: true,
    isFeatured: true,
    visitDuration: '2-4 hours',
    bestTimeToVisit: 'Evenings and weekends',
    tips: ['Try local chaat at roadside stalls', 'Visit the famous Tunday Kababi nearby', 'Great for souvenir shopping'],
    favoriteCount: 680
  },
  {
    name: 'Gomti Riverfront',
    slug: 'gomti-riverfront',
    description: 'The Gomti Riverfront is a beautifully developed promenade along the Gomti River, featuring walkways, gardens, amphitheaters, and food stalls. A popular evening destination for locals and tourists alike.',
    history: 'The Gomti River has been central to Lucknow\'s history for centuries. The modern riverfront development was completed in 2016, transforming 13km of riverbank into a world-class urban waterfront.',
    category: 'nature',
    thumbnailUrl: '/assets/placeholders/place-placeholder.jpg',
    images: [{ url: '/assets/placeholders/place-placeholder.jpg', caption: 'Gomti Riverfront - Evening View', isPrimary: true }],
    location: {
      address: 'Gomti Riverfront, Lucknow, Uttar Pradesh',
      area: 'Riverbank',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      coordinates: { lat: 26.8585, lng: 80.9389 }
    },
    timings: { open: '05:00', close: '22:00' },
    entryFee: { indian: 0, foreigner: 0, notes: 'Free; boat rides available for a fee' },
    rating: 4.2,
    reviewCount: 1780,
    tags: ['riverfront', 'nature', 'evening', 'promenade', 'park'],
    isTrending: false,
    isFeatured: true,
    visitDuration: '1-2 hours',
    bestTimeToVisit: 'Sunset',
    tips: ['Best visited at sunset', 'Boat rides available', 'Evening food stalls are great'],
    favoriteCount: 410
  },
  {
    name: 'Ambedkar Memorial Park',
    slug: 'ambedkar-memorial-park',
    description: 'Dr. Bhimrao Ambedkar Samajik Parivartan Sthal is a grand memorial park dedicated to Dr. B.R. Ambedkar and the Dalit movement. Built using pink and grey Rajasthani sandstone, it features massive columns, statues, and beautiful gardens.',
    history: 'Built by BSP government and inaugurated in 2008 by Mayawati. The park spans over 107 acres and includes 64 large elephant statues, giant pillars, and memorials to key figures in the Dalit movement.',
    category: 'cultural',
    thumbnailUrl: '/assets/placeholders/place-placeholder.jpg',
    images: [{ url: '/assets/placeholders/place-placeholder.jpg', caption: 'Ambedkar Memorial Park - Grand View', isPrimary: true }],
    location: {
      address: 'Gokhale Marg, Lucknow, Uttar Pradesh 226001',
      area: 'Gomti Nagar',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226001',
      coordinates: { lat: 26.8601, lng: 80.9846 }
    },
    timings: { open: '08:00', close: '20:00', closedOn: ['Monday'] },
    entryFee: { indian: 10, foreigner: 50, child: 5 },
    rating: 4.3,
    reviewCount: 920,
    tags: ['memorial', 'park', 'ambedkar', 'cultural', 'elephants'],
    isTrending: false,
    isFeatured: false,
    visitDuration: '1-2 hours',
    bestTimeToVisit: 'Morning or Evening',
    tips: ['Evening lighting is spectacular', 'Great for photography', 'Closed on Mondays'],
    favoriteCount: 180
  },
  {
    name: 'The Residency',
    slug: 'the-residency',
    description: 'The Residency is a group of buildings in Lucknow that was the site of the Siege of Lucknow during the Indian Rebellion of 1857. Now a well-preserved ruin and museum, it tells the story of one of the most dramatic episodes of colonial India.',
    history: 'Built in 1800 as the residence of the British Resident General. During the 1857 uprising, British forces and civilians were besieged here for 87 days. The ruins have been preserved as a national monument and the cemetery contains graves of those who died during the siege.',
    category: 'historical',
    thumbnailUrl: '/assets/placeholders/place-placeholder.jpg',
    images: [{ url: '/assets/placeholders/place-placeholder.jpg', caption: 'The Residency - Historical Ruins', isPrimary: true }],
    location: {
      address: 'Residency Road, Lucknow, Uttar Pradesh 226001',
      area: 'Residency Area',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226001',
      coordinates: { lat: 26.8583, lng: 80.9217 }
    },
    timings: { open: '09:00', close: '17:00', closedOn: ['Monday'] },
    entryFee: { indian: 25, foreigner: 300, child: 10 },
    rating: 4.4,
    reviewCount: 1150,
    tags: ['1857', 'british', 'colonial', 'heritage', 'museum', 'ruins'],
    isTrending: false,
    isFeatured: true,
    visitDuration: '1.5-2 hours',
    bestTimeToVisit: 'Morning',
    tips: ['Hire an audio guide for best experience', 'Museum inside is excellent', 'Wear comfortable shoes'],
    favoriteCount: 290
  },
  {
    name: 'Marine Drive Lucknow',
    slug: 'marine-drive-lucknow',
    description: 'Often called the "Marine Drive of Lucknow", this is a scenic drive along the Gomti River with beautifully lit roads, riverside cafes, and a vibrant nightlife. A perfect spot for evening strolls and food.',
    history: 'Developed as part of the Gomti Riverfront project, the Marine Drive stretch has become a modern landmark of Lucknow, drawing inspiration from Mumbai\'s famous Marine Drive.',
    category: 'entertainment',
    thumbnailUrl: '/assets/placeholders/place-placeholder.jpg',
    images: [{ url: '/assets/placeholders/place-placeholder.jpg', caption: 'Marine Drive - Night View', isPrimary: true }],
    location: {
      address: 'Vipin Khand, Gomti Nagar, Lucknow, Uttar Pradesh',
      area: 'Gomti Nagar',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      coordinates: { lat: 26.8509, lng: 80.9988 }
    },
    timings: { open: '00:00', close: '23:59', notes: 'Open 24 hours' },
    entryFee: { indian: 0, foreigner: 0, notes: 'Free' },
    rating: 4.1,
    reviewCount: 840,
    tags: ['marine-drive', 'riverfront', 'evening', 'food', 'nightlife'],
    isTrending: true,
    visitDuration: '1-3 hours',
    bestTimeToVisit: 'Evening to Night',
    tips: ['Evening is best', 'Great food options nearby', 'Popular during weekends'],
    favoriteCount: 220
  },
  {
    name: 'Aminabad Market',
    slug: 'aminabad-market',
    description: 'Aminabad is one of the oldest and busiest markets of Lucknow, famous for its Chikankari embroidery shops, street food, and the authentic old-world charm. A must-visit for those who want to experience the real Lucknow.',
    history: 'Established in the Nawabi era, Aminabad has been a trading hub for centuries. The market is especially famous for Chikankari work — a delicate hand-embroidery unique to Lucknow.',
    category: 'shopping',
    thumbnailUrl: '/assets/placeholders/place-placeholder.jpg',
    images: [{ url: '/assets/placeholders/place-placeholder.jpg', caption: 'Aminabad Market - Chikankari Hub', isPrimary: true }],
    location: {
      address: 'Aminabad, Lucknow, Uttar Pradesh 226018',
      area: 'Aminabad',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226018',
      coordinates: { lat: 26.8538, lng: 80.9218 }
    },
    timings: { open: '10:00', close: '21:00', closedOn: ['Sunday'] },
    entryFee: { indian: 0, foreigner: 0, notes: 'Free' },
    rating: 4.2,
    reviewCount: 1380,
    tags: ['chikankari', 'market', 'shopping', 'street-food', 'craft'],
    isTrending: false,
    visitDuration: '2-3 hours',
    bestTimeToVisit: 'Morning to Afternoon',
    tips: ['Best place to buy Chikankari', 'Bargaining is common', 'Try street food here'],
    favoriteCount: 310
  },
  {
    name: 'Lulu Mall',
    slug: 'lulu-mall',
    description: 'Lulu Mall Lucknow is one of the largest malls in India, spanning over 2.2 million sq ft. It features over 300 brands, a 25-screen multiplex, ice skating rink, gaming zone, and a massive food court.',
    history: 'Opened in 2022, LuLu Mall Lucknow was developed by LuLu Group International. It became a major landmark almost overnight and is currently the largest mall in North India.',
    category: 'entertainment',
    thumbnailUrl: '/assets/placeholders/place-placeholder.jpg',
    images: [{ url: '/assets/placeholders/place-placeholder.jpg', caption: 'Lulu Mall - Interior', isPrimary: true }],
    location: {
      address: 'Amar Shaheed Path, Sushant Golf City, Lucknow, UP 226030',
      area: 'Sushant Golf City',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226030',
      coordinates: { lat: 26.7827, lng: 80.9545 }
    },
    timings: { open: '10:00', close: '22:00' },
    entryFee: { indian: 0, foreigner: 0, notes: 'Free entry; parking charges apply' },
    rating: 4.4,
    reviewCount: 5200,
    tags: ['mall', 'shopping', 'food', 'entertainment', 'multiplex', 'modern'],
    isTrending: true,
    isFeatured: true,
    visitDuration: '3-5 hours',
    bestTimeToVisit: 'Weekdays to avoid crowds',
    tips: ['Book movie tickets online', 'Try the food court', 'Ice skating is very popular'],
    favoriteCount: 1200
  }
];

const eventsData = [
  {
    title: 'Lucknow Mahotsav 2025',
    description: 'Annual cultural festival celebrating the rich heritage, art, music, and cuisine of Lucknow. Features classical music, dance performances, craft exhibitions, and Awadhi food stalls.',
    category: 'cultural',
    // ADD EVENT BANNER HERE: /uploads/events/lucknow-mahotsav.jpg
    bannerUrl: '/assets/placeholders/event-placeholder.jpg',
    venue: { name: 'Qaiserbagh Palace Grounds', address: 'Qaiserbagh, Lucknow', coordinates: { lat: 26.8568, lng: 80.9398 } },
    startDate: new Date('2025-11-23'),
    endDate: new Date('2025-12-04'),
    timing: '5:00 PM - 10:00 PM',
    entryFee: 50,
    organizer: 'Lucknow Tourism',
    tags: ['culture', 'music', 'dance', 'food', 'heritage'],
    isFeatured: true
  },
  {
    title: 'Awadhi Food Festival',
    description: 'A 3-day extravaganza celebrating the legendary cuisine of Awadh featuring master chefs, live cooking demonstrations, and rare Nawabi recipes.',
    category: 'food',
    bannerUrl: '/assets/placeholders/event-placeholder.jpg',
    venue: { name: 'Indira Gandhi Pratishthan', address: 'Vibhuti Khand, Lucknow', coordinates: { lat: 26.8633, lng: 80.9908 } },
    startDate: new Date('2025-12-15'),
    endDate: new Date('2025-12-17'),
    timing: '11:00 AM - 9:00 PM',
    entryFee: 100,
    organizer: 'UP Tourism',
    tags: ['food', 'awadhi', 'biryani', 'kabab'],
    isFeatured: true
  },
  {
    title: 'Chikankari Craft Exhibition',
    description: 'Annual exhibition showcasing the finest Chikankari embroidery work by artisans from across Lucknow, with live demonstrations and shopping.',
    category: 'exhibition',
    bannerUrl: '/assets/placeholders/event-placeholder.jpg',
    venue: { name: 'UP Sangeet Natak Akademi', address: 'Gomti Nagar, Lucknow', coordinates: { lat: 26.854, lng: 80.993 } },
    startDate: new Date('2025-12-20'),
    endDate: new Date('2025-12-25'),
    timing: '10:00 AM - 8:00 PM',
    entryFee: 0,
    organizer: 'UP Handicrafts Board',
    tags: ['chikankari', 'craft', 'exhibition', 'artisan'],
    isFeatured: false
  }
];

const hotelsData = [
  {
    name: 'Taj Hotel & Convention Centre',
    description: 'Luxury 5-star hotel in the heart of Lucknow offering world-class amenities, fine dining, and impeccable service.',
    category: 'luxury',
    starRating: 5,
    // ADD HOTEL IMAGE HERE: /uploads/hotels/taj-lucknow.jpg
    thumbnailUrl: '/assets/placeholders/hotel-placeholder.jpg',
    location: { address: 'Vipin Khand, Gomti Nagar, Lucknow', area: 'Gomti Nagar', coordinates: { lat: 26.853, lng: 80.998 } },
    amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Business Center', 'Valet Parking'],
    priceRange: { min: 8000, max: 25000, currency: 'INR' },
    rating: 4.7,
    reviewCount: 890,
    contact: { phone: '+91-522-6711000', website: 'https://taj.tajhotels.com' },
    isFeatured: true
  },
  {
    name: 'Hyatt Regency Lucknow',
    description: 'Contemporary 5-star hotel with stunning city views, modern rooms, and exceptional dining options.',
    category: 'luxury',
    starRating: 5,
    thumbnailUrl: '/assets/placeholders/hotel-placeholder.jpg',
    location: { address: 'Vibhuti Khand, Gomti Nagar, Lucknow', area: 'Gomti Nagar', coordinates: { lat: 26.863, lng: 80.99 } },
    amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Rooftop Bar'],
    priceRange: { min: 6500, max: 18000, currency: 'INR' },
    rating: 4.6,
    reviewCount: 650,
    isFeatured: true
  },
  {
    name: 'Lemon Tree Hotel',
    description: 'A refreshing mid-range hotel with comfortable rooms, great breakfast, and excellent location near major attractions.',
    category: 'mid-range',
    starRating: 4,
    thumbnailUrl: '/assets/placeholders/hotel-placeholder.jpg',
    location: { address: 'Vibhuti Khand, Gomti Nagar, Lucknow', area: 'Gomti Nagar', coordinates: { lat: 26.858, lng: 80.989 } },
    amenities: ['WiFi', 'Restaurant', 'Gym', 'Conference Room'],
    priceRange: { min: 3000, max: 6000, currency: 'INR' },
    rating: 4.2,
    reviewCount: 420,
    isFeatured: false
  }
];

const restaurantsData = [
  {
    name: 'Tunday Kababi',
    description: 'The legendary Lucknow restaurant famous since 1905 for its iconic Galouti Kebabs, made from a secret 160-spice recipe. A true Awadhi dining institution.',
    cuisine: ['Awadhi', 'Mughlai', 'Kebab'],
    category: 'casual',
    // ADD RESTAURANT IMAGE HERE: /uploads/restaurants/tunday-kababi.jpg
    thumbnailUrl: '/assets/placeholders/restaurant-placeholder.jpg',
    location: { address: 'Aminabad, Lucknow, UP 226018', area: 'Aminabad', coordinates: { lat: 26.8538, lng: 80.9218 } },
    timings: { open: '07:00', close: '23:00' },
    priceForTwo: 400,
    rating: 4.8,
    reviewCount: 5600,
    specialDishes: ['Galouti Kebab', 'Shami Kebab', 'Seekh Kebab', 'Ulte Tawa ka Paratha'],
    features: ['Dine-in', 'Takeaway', 'Home Delivery'],
    isFeatured: true
  },
  {
    name: 'Idris Biryani',
    description: 'Famous for the authentic Lucknow-style Awadhi Biryani, cooked in the traditional dum style with fragrant basmati rice and tender meat.',
    cuisine: ['Awadhi', 'Biryani'],
    category: 'casual',
    thumbnailUrl: '/assets/placeholders/restaurant-placeholder.jpg',
    location: { address: 'Akbari Gate, Chowk, Lucknow', area: 'Chowk', coordinates: { lat: 26.874, lng: 80.908 } },
    timings: { open: '12:00', close: '23:00' },
    priceForTwo: 500,
    rating: 4.7,
    reviewCount: 3200,
    specialDishes: ['Dum Biryani', 'Mutton Biryani', 'Chicken Biryani'],
    features: ['Dine-in', 'Takeaway'],
    isFeatured: true
  },
  {
    name: 'Basket Chaat Bhandar',
    description: 'The original home of Basket Chaat in Lucknow — crispy fried flour baskets filled with spiced potato filling, chutneys and toppings.',
    cuisine: ['Chaat', 'Street Food'],
    category: 'street-food',
    thumbnailUrl: '/assets/placeholders/restaurant-placeholder.jpg',
    location: { address: 'Hazratganj, Lucknow', area: 'Hazratganj', coordinates: { lat: 26.8488, lng: 80.9478 } },
    timings: { open: '11:00', close: '22:00' },
    priceForTwo: 200,
    rating: 4.6,
    reviewCount: 1900,
    specialDishes: ['Basket Chaat', 'Papdi Chaat', 'Dahi Puri'],
    features: ['Dine-in', 'Takeaway'],
    isFeatured: true
  }
];

const foodsData = [
  {
    name: 'Tunday Kababi (Galouti Kebab)',
    description: 'The legendary melt-in-the-mouth kebab made from minced meat and a secret blend of over 160 spices. So tender it was originally created for a toothless Nawab.',
    history: 'Created by Haji Murad Ali (known as Tunday - meaning one-armed) for Nawab Wajid Ali Shah in the early 1900s. The recipe remains a closely-guarded family secret passed down through generations.',
    // ADD FOOD IMAGE HERE: /uploads/food/galouti-kebab.jpg (600x400px)
    imageUrl: '/assets/placeholders/food-placeholder.jpg',
    category: 'kebab',
    isVegetarian: false,
    spiceLevel: 'medium',
    bestPlaces: [{ name: 'Tunday Kababi', address: 'Aminabad, Lucknow' }, { name: 'Royal Café', address: 'Hazratganj' }],
    averagePrice: 180,
    tags: ['kebab', 'mughlai', 'awadhi', 'must-try'],
    isFeatured: true
  },
  {
    name: 'Basket Chaat',
    description: 'A uniquely Lucknowi invention — crispy fried flour baskets filled with spiced boiled potatoes, chutneys, yogurt, and sev. A street food masterpiece.',
    history: 'Invented in Lucknow in the early 20th century, Basket Chaat represents the city\'s love for inventive street food. The crispy edible basket is unique to Lucknow and not found elsewhere in India.',
    imageUrl: '/assets/placeholders/food-placeholder.jpg',
    category: 'chaat',
    isVegetarian: true,
    spiceLevel: 'medium',
    bestPlaces: [{ name: 'Shukla Chaat House', address: 'Aminabad' }, { name: 'Basket Chaat Bhandar', address: 'Hazratganj' }],
    averagePrice: 80,
    tags: ['chaat', 'street-food', 'vegetarian', 'must-try'],
    isFeatured: true
  },
  {
    name: 'Makhan Malai (Nimish)',
    description: 'A heavenly winter dessert made from whipped milk foam flavored with saffron and rose water. Light as air and available only in winters, this is Lucknow\'s most ethereal sweet.',
    history: 'An ancient Lucknow delicacy, Makhan Malai (also known as Nimish or Daulat ki Chaat in Delhi) is prepared overnight by leaving milk to ferment and then whipping it at dawn. Available only from October to February.',
    imageUrl: '/assets/placeholders/food-placeholder.jpg',
    category: 'dessert',
    isVegetarian: true,
    spiceLevel: 'mild',
    bestPlaces: [{ name: 'Chowk Market', address: 'Chowk, Lucknow' }, { name: 'Aminabad', address: 'Aminabad, Lucknow' }],
    averagePrice: 50,
    tags: ['sweet', 'winter', 'dessert', 'seasonal', 'milk'],
    isFeatured: true
  },
  {
    name: 'Awadhi Biryani',
    description: 'The iconic Lucknow-style biryani cooked using the dum (slow steam) method, with fragrant basmati rice layered over marinated meat with saffron, rose water and whole spices.',
    history: 'Developed in the royal kitchens of the Nawabs of Awadh, this biryani style is distinguished from Hyderabadi biryani by its milder, more aromatic spicing and the characteristic "pukki" method where rice and meat are partially cooked separately.',
    imageUrl: '/assets/placeholders/food-placeholder.jpg',
    category: 'biryani',
    isVegetarian: false,
    spiceLevel: 'medium',
    bestPlaces: [{ name: 'Idris Biryani', address: 'Chowk, Lucknow' }, { name: 'Wahid Biryani', address: 'Hazratganj' }],
    averagePrice: 250,
    tags: ['biryani', 'awadhi', 'rice', 'must-try', 'dum'],
    isFeatured: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Place.deleteMany({}),
      Event.deleteMany({}),
      Hotel.deleteMany({}),
      Restaurant.deleteMany({}),
      Food.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@lucknowexplore.com',
      password: 'Admin@123',
      role: 'admin',
      city: 'Lucknow',
      bio: 'Platform administrator for Lucknow Explore'
    });
    console.log('👤 Admin user created: admin@lucknowexplore.com / Admin@123');

    // Create test user
    await User.create({
      name: 'Test User',
      email: 'user@lucknowexplore.com',
      password: 'User@123',
      role: 'user',
      city: 'Lucknow'
    });
    console.log('👤 Test user created: user@lucknowexplore.com / User@123');

    // Seed places
    const placesWithAdmin = placesData.map(p => ({ ...p, createdBy: adminUser._id }));
    const places = await Place.insertMany(placesWithAdmin);
    console.log(`🏛️  ${places.length} places seeded`);

    // Seed events
    const eventsWithAdmin = eventsData.map(e => ({ ...e, createdBy: adminUser._id }));
    await Event.insertMany(eventsWithAdmin);
    console.log(`🎉 ${eventsData.length} events seeded`);

    // Seed hotels
    await Hotel.insertMany(hotelsData);
    console.log(`🏨 ${hotelsData.length} hotels seeded`);

    // Seed restaurants
    await Restaurant.insertMany(restaurantsData);
    console.log(`🍽️  ${restaurantsData.length} restaurants seeded`);

    // Seed foods
    await Food.insertMany(foodsData);
    console.log(`🍢 ${foodsData.length} food items seeded`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin: admin@lucknowexplore.com / Admin@123');
    console.log('   User:  user@lucknowexplore.com / User@123\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seedDatabase();
