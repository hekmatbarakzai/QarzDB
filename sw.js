const CACHE = "qarz-shell-v4-cloud-sync";
const FILES = ["./", "./index.html", "./manifest.json", "./icon.svg", "./icon.png", "./icon-192.png", "./auth-core.js", "./auth.js", "./auth.css", "./cloud.css", "./cloud-config.js", "./cloud.js", "./app.js"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith("qarz-") && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    try {
      const response = await fetch(event.request);
      if (response.ok && (event.request.mode === "navigate" || FILES.some(file => new URL(file, self.registration.scope).href === event.request.url))) {
        await cache.put(event.request, response.clone());
      }
      return response;
    } catch (error) {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      if (event.request.mode === "navigate") return cache.match("./index.html");
      return Response.error();
    }
  }));
});
