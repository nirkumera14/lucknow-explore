// public/sw.js - Service Worker for PWA offline support
const CACHE_NAME = 'lucknow-explore-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/placeholders/place-placeholder.jpg',
  '/assets/placeholders/event-placeholder.jpg',
  '/assets/placeholders/hotel-placeholder.jpg',
  '/assets/placeholders/restaurant-placeholder.jpg',
  '/assets/placeholders/food-placeholder.jpg',
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) return;

  // API calls - network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets - cache first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback for HTML pages
      if (request.headers.get('accept')?.includes('text/html')) {
        return caches.match('/index.html');
      }
    })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reviews') {
    event.waitUntil(syncPendingReviews());
  }
});

async function syncPendingReviews() {
  // Sync any offline-created reviews when back online
  const db = await openDB();
  const pending = await db.getAll('pending-reviews');
  for (const review of pending) {
    try {
      await fetch('/api/reviews/' + review.placeId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + review.token },
        body: JSON.stringify(review.data)
      });
      await db.delete('pending-reviews', review.id);
    } catch {}
  }
}
