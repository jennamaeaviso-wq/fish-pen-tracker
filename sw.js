const CACHE_NAME = "fish-pen-tracker-v5";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(APP_FILES);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keys) {
        return Promise.all(
          keys
            .filter(function(key) {
              return key !== CACHE_NAME;
            })
            .map(function(key) {
              return caches.delete(key);
            })
        );
      })
      .then(function() {
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", function(event) {

  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(function(response) {

        if (response && response.ok) {
          var copy = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, copy);
            });
        }

        return response;
      })
      .catch(function() {
        return caches.match(event.request);
      })
  );

});
