// sw.js
const CACHE_NAME = 'unix-radio-v1';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/manifest.json',
                '/favicon.png',
                '/js/app.js',
                '/js/audio-engine.js',
                '/js/ui.js',
                '/js/volume-controller.js',
                '/js/config.js'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
