const CACHE = "kosovo-handy-public-v1";
const API = "/api/puntoret";
const SHELL = ["/offline.html", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys
      .filter(key => key.startsWith("kosovo-handy-public-") && key !== CACHE)
      .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

async function readPublicList(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Lista nuk erdhi nga serveri");
    }
    const headers = new Headers(response.headers);
    headers.set("x-handy-source", "network");
    headers.set("x-handy-saved-at", new Date().toISOString());
    const fresh = new Response(await response.text(), { status: 200, headers });
    try {
      await cache.put(API, fresh.clone());
    } catch {
      fresh.headers.delete("x-handy-saved-at");
    }
    return fresh;
  } catch {
    const saved = await cache.match(API);
    if (!saved) {
      return new Response(JSON.stringify({ error: "no_snapshot" }), {
        status: 503,
        headers: { "content-type": "application/json" },
      });
    }
    const headers = new Headers(saved.headers);
    headers.set("x-handy-source", "cache");
    return new Response(await saved.text(), { status: 200, headers });
  }
}

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (url.pathname === API && !url.search) {
    event.respondWith(readPublicList(request));
  } else if (request.mode === "navigate" && ["/", "/offline.html"].includes(url.pathname)) {
    event.respondWith(
      fetch(request).catch(async () => {
        const saved = await caches.match("/offline.html");
        return saved || new Response("Hape Kosovo Handy një herë me internet.", { status: 503 });
      })
    );
  }
  // POST, /api/auth, /ndrysho dhe faqet private nuk ruhen.
});