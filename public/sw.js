// Bump this on every deploy so returning visitors pick up the new build
// instead of being stuck on a stale cached version.
const CACHE_NAME = "engish-quiz-cache-v3";

// The very first page load is never "controlled" by this service worker (control only
// starts after activation), so passively caching whatever the fetch handler happens to see
// would miss everything on that first visit. Instead, explicitly fetch and cache the app
// shell — the root document plus every hashed asset it references — during install, so a
// single online visit is enough for the app to work offline afterward.
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const shellUrls = new Set(["/", "/manifest.webmanifest", "/favicon.png", "/apple-touch-icon.png"]);

      try {
        const htmlResponse = await fetch("/", { cache: "no-store" });
        const html = await htmlResponse.clone().text();
        const attrRegex = /(?:href|src)="(\/[^"]+)"/g;
        let match;
        while ((match = attrRegex.exec(html))) {
          shellUrls.add(match[1]);
        }
        await cache.put("/", htmlResponse);
      } catch {
        // Offline at install time (unlikely) — fall back to runtime caching only.
      }

      await Promise.all(
        [...shellUrls].map(async (url) => {
          if (url === "/") return;
          try {
            const response = await fetch(url, { cache: "no-store" });
            if (response.ok) await cache.put(url, response);
          } catch {
            // Skip anything that fails to fetch; runtime caching can still pick it up later.
          }
        })
      );
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Match by URL string, not the Request object — module scripts and other resources
      // are fetched by the browser with request modes/credentials that can differ from how
      // they were originally cached, which makes Request-based cache.match() silently miss.
      const cached = await cache.match(url.pathname + url.search);
      if (cached) return cached;

      try {
        const response = await fetch(event.request);
        if (response.ok) cache.put(event.request, response.clone());
        return response;
      } catch {
        return cached || new Response("Offline and not cached yet.", { status: 503 });
      }
    })
  );
});
