const CACHE_NAME = "twoj-jadlospis-v1.0.8";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=1.0.8",
  "./app.js?v=1.0.8",
  "./manifest.webmanifest?v=1.0.8",
  "./offline.html",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/placeholder-food.png",
  "./assets/placeholder-breakfast.png",
  "./assets/placeholder-salad.png",
  "./assets/placeholder-dinner.png",
  "./assets/placeholder-snack.png",
  "./assets/placeholder-supper.png",
  "./assets/placeholder-plan.png",
  "./assets/nav-plate.png",
  "./assets/nav-plate-clean.png",
  "./assets/calendar-clean.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }
  event.respondWith(staleWhileRevalidate(request));
});

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put("./index.html", response.clone());
    return response;
  } catch (error) {
    return (await caches.match("./index.html")) || (await caches.match("./offline.html"));
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    if (request.destination === "document") return caches.match("./offline.html");
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const network = fetch(request).then(response => {
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);
  return cached || network;
}
