const ADMIN_CACHE_NAME = 'sewashubham-admin-v1';
const ADMIN_URLS_TO_CACHE = [
  '/manifest-admin.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(ADMIN_CACHE_NAME)
      .then((cache) => cache.addAll(ADMIN_URLS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate event - cleanup old admin caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Only delete admin caches, not the main site cache
          if (cacheName.startsWith('sewashubham-admin-') && cacheName !== ADMIN_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first for admin (always fresh data)
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip API requests — let them go to network directly
  if (event.request.url.includes('/api/')) return;

  // Skip development resources
  if (
    event.request.url.includes('/src/') ||
    event.request.url.includes('/node_modules/') ||
    event.request.url.includes('/@') ||
    event.request.url.includes('chrome-extension')
  ) {
    return;
  }

  // Navigation requests — always network, offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          `<!DOCTYPE html>
          <html>
          <body style="font-family:sans-serif;text-align:center;padding:40px;background:#1C1C1C;color:#fff">
            <div style="max-width:360px;margin:0 auto">
              <div style="font-size:64px;margin-bottom:16px">📡</div>
              <h2 style="color:#C97B4B;margin-bottom:8px">You are offline</h2>
              <p style="color:#999;font-size:14px">Admin panel requires an internet connection to manage orders and menu.</p>
              <button onclick="location.reload()" 
                style="margin-top:20px;padding:12px 32px;background:#C97B4B;color:#fff;border:none;border-radius:12px;font-weight:bold;cursor:pointer">
                Retry
              </button>
            </div>
          </body>
          </html>`,
          { status: 200, headers: { 'Content-Type': 'text/html' } }
        );
      })
    );
    return;
  }

  // Static assets — network first, cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(ADMIN_CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          return new Response('Network error', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
          });
        });
      })
  );
});
