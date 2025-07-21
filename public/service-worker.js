const CACHE_NAME = "marhabahaji-cache-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/placeholder.svg",
  "/offline.html",
  // Add more assets as needed
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Failed to cache resources:", error);
        // Cache files individually to avoid failing on missing files
        return Promise.allSettled(
          urlsToCache.map((url) =>
            cache
              .add(url)
              .catch((err) => console.warn(`Failed to cache ${url}:`, err)),
          ),
        );
      });
    }),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    (async () => {
      try {
        // Try network first
        const response = await fetch(event.request);
        return response;
      } catch (networkError) {
        console.warn("Network request failed:", networkError);
        try {
          const cacheResponse = await caches.match(event.request);
          if (cacheResponse) return cacheResponse;
          if (event.request.mode === "navigate") {
            const offlinePage = await caches.match("/offline.html");
            if (offlinePage) return offlinePage;
          }
        } catch (cacheError) {
          console.error("Cache lookup failed:", cacheError);
        }
        // Always return a valid Response
        return new Response("Service unavailable", {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "text/plain" },
        });
      }
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
    }),
  );
});
