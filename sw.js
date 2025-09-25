// Define a cache name for your app's assets.
const CACHE_NAME = 'paper-analysis-v1';

// List of files to cache for offline use.
const URLS_TO_CACHE = [
    '/',
    './index.html',
    './questions-data.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png'
];

// Install event: triggered when the service worker is first installed.
self.addEventListener('install', event => {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                // Add all the specified URLs to the cache.
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

// Fetch event: triggered for every network request made by the page.
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // If the request is found in the cache, return the cached response.
                if (response) {
                    return response;
                }
                // If the request is not in the cache, fetch it from the network.
                return fetch(event.request);
            })
    );
});

// Activate event: triggered when the service worker is activated.
// This is a good place to clean up old caches.
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // If a cache is not in our whitelist, delete it.
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
