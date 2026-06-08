# 🏛️ Lucknow Explore — Smart Tourism Platform

> **A full-stack, production-ready smart tourism web application for Lucknow, the City of Nawabs.** Built with the MERN stack, featuring AI-powered travel planning, QR-based smart exploration, offline PWA support, and a premium glassmorphism UI.

![Lucknow Explore](https://img.shields.io/badge/version-1.0.0-gold)
![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/stack-MERN-green)

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Adding Images](#adding-images)
- [Database Seeding](#database-seeding)
- [API Reference](#api-reference)
- [Docker Deployment](#docker-deployment)
- [Admin Panel](#admin-panel)
- [PWA & Offline Support](#pwa--offline-support)

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🏛️ **10 Tourist Places** | Bara Imambara, Rumi Darwaza, Hazratganj & 7 more with full details |
| 🤖 **AI Travel Planner** | Claude AI-powered personalized itinerary chatbot |
| 📱 **QR Smart Tourism** | Generate & scan QR codes at every tourist spot |
| 📶 **Offline PWA** | Service workers, IndexedDB, offline-first architecture |
| 🔐 **JWT Auth** | Signup/Login/Logout with role-based access (User/Admin) |
| 🗺️ **Interactive Maps** | Leaflet.js maps with GPS coordinates for all places |
| ⭐ **Reviews System** | Rate and review places with star ratings |
| ❤️ **Favorites** | Save and manage favorite places |
| 🎭 **Events** | Browse cultural events, food festivals, exhibitions |
| 🏨 **Hotels** | Browse hotels by category with booking links |
| 🍽️ **Restaurants** | Explore restaurants with cuisine, price & ratings |
| 🍢 **Food & Culture** | Deep-dive into Awadhi cuisine heritage |
| 👑 **Admin Dashboard** | Full CRUD for places, events, hotels, QR generation |
| 📊 **Analytics** | View scan stats, trending places, user data |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | UI framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Redux Toolkit | State management |
| React Router v6 | Routing |
| Leaflet.js | Maps |
| html5-qrcode | QR Scanner |
| react-hot-toast | Notifications |
| Vite PWA Plugin | PWA / Service Workers |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | API server |
| MongoDB + Mongoose | Database |
| JWT + bcryptjs | Authentication |
| QRCode | QR generation |
| Multer | File uploads |
| Helmet + CORS | Security |

---

## 📁 Project Structure

```
lucknow-explore/
├── backend/
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── placesController.js
│   │   ├── qrController.js
│   │   ├── reviewsController.js
│   │   └── contentController.js
│   ├── models/              # MongoDB schemas
│   │   ├── User.js
│   │   ├── Place.js
│   │   └── index.js         # Review, Event, Hotel, Restaurant, Food, QRScan
│   ├── routes/              # Express routes
│   ├── middleware/          # Auth middleware
│   ├── data/
│   │   └── seed.js          # Database seeder
│   ├── uploads/             # Uploaded images (created at runtime)
│   │   ├── places/          # ← ADD PLACE IMAGES HERE
│   │   ├── events/          # ← ADD EVENT BANNERS HERE
│   │   ├── hotels/          # ← ADD HOTEL IMAGES HERE
│   │   ├── restaurants/     # ← ADD RESTAURANT IMAGES HERE
│   │   ├── food/            # ← ADD FOOD IMAGES HERE
│   │   └── avatars/         # User profile photos
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   ├── assets/
│   │   │   └── placeholders/    # Placeholder images
│   │   ├── favicon.svg
│   │   └── sw.js               # Service Worker
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # ProtectedRoute, AdminRoute, Skeleton, Offline
│   │   │   ├── layout/          # Navbar, Footer
│   │   │   └── places/          # PlaceCard
│   │   ├── pages/               # All 15 pages
│   │   ├── store/               # Redux store + slices
│   │   ├── utils/               # Axios API instance
│   │   └── styles/              # Global CSS
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Clone the repo
git clone <your-repo-url>
cd lucknow-explore

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Frontend
cd ../frontend
cp .env.example .env
# Edit VITE_API_URL if needed
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- ✅ 10 tourist places with full data
- ✅ 3 events, 3 hotels, 3 restaurants, 4 food items
- ✅ Admin user: `admin@lucknowexplore.com` / `Admin@123`
- ✅ Test user: `user@lucknowexplore.com` / `User@123`

### 4. Start Development Servers

```bash
# Terminal 1 - Backend (runs on :5000)
cd backend
npm run dev

# Terminal 2 - Frontend (runs on :5173)
cd frontend
npm run dev
```

Open **http://localhost:5173** 🎉

---

## 🔐 Environment Variables

### Backend `.env`
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/lucknow-explore
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Lucknow Explore
```

---

## 🖼️ Adding Real Images

The project uses placeholder images. Replace them by uploading real images through the **Admin Panel** or by placing files in the correct directories.

### Image Locations

| Content | Upload Path | Recommended Size |
|---------|-------------|-----------------|
| Tourist Places | `/backend/uploads/places/` | 1200×800px |
| Place Thumbnails | Admin Panel → Edit Place | 400×300px |
| Event Banners | `/backend/uploads/events/` | 1200×500px |
| Hotel Photos | `/backend/uploads/hotels/` | 800×500px |
| Restaurant Photos | `/backend/uploads/restaurants/` | 800×500px |
| Food Photos | `/backend/uploads/food/` | 600×400px |
| User Avatars | Auto-upload on profile edit | 200×200px |

### Via Admin Panel
1. Login as admin (`admin@lucknowexplore.com` / `Admin@123`)
2. Go to **Admin Panel → Places**
3. Click **Edit** on any place
4. Upload images through the image upload field

### Updating Placeholder URLs
Image paths in the database are configurable. After uploading, update `thumbnailUrl` in each place document or use the Admin Panel edit form.

---

## 🌱 Database Seeding

```bash
cd backend
npm run seed
```

The seed script populates:

- **Places**: Bara Imambara, Chota Imambara, Rumi Darwaza, Hazratganj, Gomti Riverfront, Ambedkar Memorial Park, The Residency, Marine Drive, Aminabad Market, Lulu Mall
- **Events**: Lucknow Mahotsav, Awadhi Food Festival, Chikankari Exhibition
- **Hotels**: Taj Hotel, Hyatt Regency, Lemon Tree
- **Restaurants**: Tunday Kababi, Idris Biryani, Basket Chaat Bhandar
- **Foods**: Galouti Kebab, Basket Chaat, Makhan Malai, Awadhi Biryani

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/logout` | Logout |

### Places
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/places` | Get all places (with filters) |
| GET | `/api/places/trending` | Get trending places |
| GET | `/api/places/:slug` | Get single place |
| POST | `/api/places` | Create place (admin) |
| PUT | `/api/places/:id` | Update place (admin) |
| DELETE | `/api/places/:id` | Delete place (admin) |
| POST | `/api/places/:id/favorite` | Toggle favorite |

### QR Codes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/qr/generate/:id` | Generate QR for place (admin) |
| POST | `/api/qr/generate-all` | Generate all QRs (admin) |
| POST | `/api/qr/scan` | Record a QR scan |
| GET | `/api/qr/history` | Get user scan history |
| GET | `/api/qr/download/:id` | Download QR as PNG |

### Query Parameters for GET /api/places
```
?category=historical|religious|shopping|entertainment|cultural|nature
?search=bara imambara
?sort=-rating|-favoriteCount|-reviewCount|name
?page=1&limit=12
?trending=true
?featured=true
?minRating=4
```

---

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up --build -d

# Seed the database
docker-compose exec backend node data/seed.js

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Services:
- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

---

## 👑 Admin Panel

Access the admin panel at `/admin` (must be logged in as admin).

### Admin Features
- **Overview**: Stats dashboard with totals, top places, recent scans
- **Places**: Full CRUD — create, edit, delete tourist places
- **Events**: Manage cultural events and festivals
- **Hotels**: Manage hotel listings
- **Restaurants**: Manage restaurant listings
- **Users**: View and manage user accounts
- **QR Codes**: Generate QR codes for all places, download PNGs
- **Reviews**: View and moderate user reviews

### Default Admin Credentials
```
Email: admin@lucknowexplore.com
Password: Admin@123
```
⚠️ **Change these immediately in production!**

---

## 📶 PWA & Offline Support

The app is a Progressive Web App with:

- **Service Worker** (`/public/sw.js`) — caches all assets and API responses
- **Offline Mode** — cached places viewable without internet
- **Install Prompt** — users can install the app on mobile/desktop
- **Offline Indicator** — banner shown when offline
- **Cache Strategy**: Network-first for API, Cache-first for images

To test offline: Open DevTools → Application → Service Workers → Offline checkbox.

---

## 🗺️ Map Integration

The app uses **Leaflet.js** (free, no API key) with OpenStreetMap tiles.

To switch to Google Maps:
1. Get a Google Maps API key
2. Set `VITE_GOOGLE_MAPS_KEY` in frontend `.env`
3. Replace `TileLayer` in `PlaceDetailPage.jsx` with Google Maps layer

---

## 🔒 Security Features

- JWT authentication with 30-day expiry
- Password hashing with bcrypt (12 rounds)
- Helmet.js for HTTP security headers
- CORS configured for specific origins
- Rate limiting (200 req/15 min per IP)
- Input validation with express-validator
- Soft deletes (data never permanently removed)
- Role-based authorization (user/admin)

---

## 📱 Supported Browsers

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile Chrome | ✅ Full |
| Mobile Safari | ✅ Full |

---

## 🚀 Production Deployment

### Render.com (Backend)
1. Connect GitHub repo
2. Set build command: `npm install`
3. Set start command: `node server.js`
4. Add environment variables from `.env`

### Vercel (Frontend)
1. Connect GitHub repo, select `/frontend` folder
2. Build: `npm run build`, Output: `dist`
3. Add `VITE_API_URL` environment variable pointing to your Render backend URL

### MongoDB Atlas (Database)
1. Create free cluster at cloud.mongodb.com
2. Get connection string
3. Set as `MONGO_URI` in backend env

---

## 📝 License

MIT License — free to use, modify and distribute.

---

## 🙏 Acknowledgements

- Lucknow Tourism Board for place information
- OpenStreetMap contributors for map data
- Anthropic Claude for AI travel planning
- The open source community

---

**Made with ❤️ for the City of Nawabs — Lucknow 🏛️**
