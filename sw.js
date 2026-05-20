const CACHE_NAME = 'piano-master-v8';
const ASSETS = [
  './',
  './index.html',
  './piano-v3.html',
  './v7_patch.js',
  './v8_patch.js',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (!res.ok || !res.headers.get('content-type')?.includes('text/html')) {
          return res;
        }
        return res.text().then(html => {
          if (!html.includes('v7_patch.js') && html.includes('</body>')) {
            html = html.replace('</body>', '<script src="v7_patch.js"></script></body>');
          }
          if (!html.includes('v8_patch.js') && html.includes('</body>')) {
            html = html.replace('</body>', '<script src="v8_patch.js"></script></body>');
          }
          const clone = new Response(html, {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers
          });
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone.clone()));
          return new Response(html, {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers
          });
        });
      }).catch(() => {
        return caches.match(e.request).then(cached => {
          if (cached) return cached;
          return new Response('<h1>오프라인</h1><p>인터넷 연결을 확인하세요.</p>', {
            headers: {'Content-Type': 'text/html; charset=utf-8'}
          });
        });
      })
    );
    return;
  }

  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
