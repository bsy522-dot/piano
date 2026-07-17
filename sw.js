const CACHE_NAME = 'piano-master-v21';
const ASSETS = [
  './',
  './index.html',
  './piano-v3.html',
  './v7_patch.js',
  './v8_patch.js',
  './v9_patch.js',
  './v10_patch.js',
  './v11_patch.js',
  './v12_patch.js',
  './v13_patch.js',
  './v14_patch.js',
  './v15_patch.js',
  './v16_patch.js',
  './v17_patch.js',
  './v18_patch.js',
  './v19_patch.js',
  './v20_patch.js',
  './v21_patch.js',
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
          if (!html.includes('v9_patch.js') && html.includes('</body>')) {
            html = html.replace('</body>', '<script src="v9_patch.js"></script></body>');
          }
          if (!html.includes('v10_patch.js') && html.includes('</body>')) {
            html = html.replace('</body>', '<script src="v10_patch.js"></script></body>');
          }
          if (!html.includes('v11_patch.js') && html.includes('</body>')) {
            html = html.replace('</body>', '<script src="v11_patch.js"></script></body>');
          }
          if (!html.includes('v12_patch.js') && html.includes('</body>')) {
            html = html.replace('</body>', '<script src="v12_patch.js"></script></body>');
          }
          if (!html.includes('v13_patch.js') && html.includes('</body>')) {
            html = html.replace('</body>', '<script src="v13_patch.js"></script></body>');
          }
          if (!html.includes('v14_patch.js') && html.includes('</body>')) {
            html = html.replace('</body>', '<script src="v14_patch.js"></script></body>');
          }
          if (!html.includes('v15_patch.js') && html.includes('</body>')) {
            html = html.replace('</body>', '<script src="v15_patch.js"></script></body>');
          }
          if (!html.includes('v16_patch.js') && html.includes('</body>')) {
            html = html.replace('</body>', '<script src="v16_patch.js"></script></body>');
          }
          if (!html.includes('v17_patch.js') && html.includes('</body>')) {
            html = html.replace('</body>', '<script src="v17_patch.js"></script></body>');
          }
          if (!html.includes('v18_patch.js') && html.includes('</body>')) {
            html = html.replace('</body>', '<script src="v18_patch.js"></script></body>');
          }
          if (!html.includes('v19_patch.js') && html.includes('</body>')) {
            html = html.replace('</body>', '<script src="v19_patch.js"></script></body>');
          }
          if (!html.includes('v20_patch.js') && html.includes('</body>')) {
            html = html.replace('</body>', '<script src="v20_patch.js"></script></body>');
          }
          if (!html.includes('v21_patch.js') && html.includes('</body>')) {
            html = html.replace('</body>', '<script src="v21_patch.js"></script></body>');
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
