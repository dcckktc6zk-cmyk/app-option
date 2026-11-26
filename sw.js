/* 오프라인용: 처음 열 때 파일을 저장해 두고, 인터넷이 없으면 저장본으로 연다. 화면(index.html)은 인터넷이 되면 항상 새 버전을 먼저 받는다. */
const CACHE = 'aptopt-5bc3dcb422';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable.png', 'apple-touch-icon.png', 'favicon.png', 'gs-logo.png', 'xi-white.png', 'xi-navy.png', 'pdf.min.mjs', 'pdf.worker.min.mjs'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put('./', cp)); return res; }).catch(() => caches.match('./').then(m => m || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(r, {ignoreSearch: true}).then(m => m || fetch(r)));
});
