const CACHE_NAME = "calorie-app-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch (offline support)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});