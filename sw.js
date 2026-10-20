const CACHE_NAME = "apt-tracker-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./js/data-plan.js",
  "./js/data-schedule.js",
  "./js/data-workouts.js",
  "./js/data-diet.js",
  "./js/data-apt.js",
  "./js/data-media.js",
  "./js/figure.js",
  "./js/store.js",
  "./js/app.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

/* App files are precached above. Exercise photos (5.6 MB) are not — each is
   cached the first time it is viewed, so a phone only stores the ones used,
   and they keep working with no signal in the gym afterwards. */
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const isPhoto = new URL(event.request.url).pathname.includes("/img/ex/");
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        if (isPhoto && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, copy));
        }
        return res;
      });
    })
  );
});
