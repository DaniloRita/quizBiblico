const CACHE_NAME = "quiz-cache-v7";

const urlsToCache = [
  "./",
  "./index.html",
  "./app.js",
  "./manifest.json",

  "./musica/toc.mp3",
  "./musica/tempo.mp3",
  "./musica/victoria.mp3",
  "./musica/lose.mp3",
  "./musica/acerto.mp3",
  "./musica/errado.mp3",
  "./musica/fundo.mp3",

  "./img/icon-192.png",
  "./img/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
