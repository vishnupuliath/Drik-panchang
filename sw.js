const CACHE_NAME = 'nakshatram-v1';
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// Handle scheduled notifications via stored alarms
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});

// Periodic check for due reminders
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'CHECK_REMINDERS') {
    const reminders = e.data.reminders || [];
    const now = Date.now();
    reminders.forEach(r => {
      if (r.time <= now && !r.shown) {
        self.registration.showNotification(r.title, {
          body: r.body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: r.id,
          data: r
        });
      }
    });
  }
});
