// Cat Element offline support.
// The game page itself is fetched fresh whenever there is internet (so testers always get the newest version),
// and falls back to the saved copy when offline. Icons, fonts and other files are served from the saved copy.
const CACHE = 'cat-element-v40';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(APP_SHELL.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const ready = (async () => {
    const keys = await caches.keys();
    const old = keys.filter(k => k !== CACHE);
    await Promise.all(old.map(k => caches.delete(k)));
    await self.clients.claim();
    return old.length > 0;
  })();
  event.waitUntil(ready);
  // An older version was open: once this worker is fully active, reload it so the player sees the update right away.
  // (This must happen after activation finishes, or the reload would wait on this worker forever.)
  ready.then(updated => {
    if (!updated) return;
    setTimeout(() => {
      self.clients.matchAll({ type: 'window' }).then(wins => wins.forEach(w => { try { w.navigate(w.url); } catch (e) {} }));
    }, 50);
  });
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = req.mode === 'navigate' || (url.origin === location.origin && (url.pathname.endsWith('/') || url.pathname.endsWith('.html')));

  if (isPage) {
    // Newest version first; saved copy if offline or the network is too slow.
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const fresh = await Promise.race([
          fetch(req, { cache: 'no-store' }),
          new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 4000))
        ]);
        if (fresh && fresh.ok) cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        return (await cache.match(req)) || (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  if (url.origin === location.origin || url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(req).then(hit => {
          const fresh = fetch(req).then(res => {
            if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
            return res;
          }).catch(() => hit);
          return hit || fresh;
        })
      )
    );
  }
});
