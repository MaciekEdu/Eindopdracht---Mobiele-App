const CACHE_NAME = "calorie-app-v1";


const urlsToCache = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];


// Install
self.addEventListener("install", event => {
  self.skipWaiting(); //  zorgt dat nieuwe SW direct actief wordt
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim()); //  neemt direct controle over
});

// Fetch (offline support)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
``