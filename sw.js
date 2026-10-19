const CACHE_NAME = 'aura-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/src/styles/index.css',
  '/src/js/main.js',
  '/src/js/3d_engine.js',
  '/src/js/audio_engine.js',
  '/src/js/ai_engine.js',
  '/src/js/modules.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
