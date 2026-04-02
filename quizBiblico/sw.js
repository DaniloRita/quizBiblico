const CACHE_NAME = "quiz-cache-v9";

const urlsToCache = [
  "/quizBiblico/quizBiblico/",
  "/quizBiblico/quizBiblico/index.html",
  "/quizBiblico/quizBiblico/app.js",
  "/quizBiblico/quizBiblico/manifest.json",

  // 🔊 ÁUDIOS
  "/quizBiblico/quizBiblico/musica/toc.mp3",
  "/quizBiblico/quizBiblico/musica/tempo.mp3",
  "/quizBiblico/quizBiblico/musica/victoria.mp3",
  "/quizBiblico/quizBiblico/musica/lose.mp3",
  "/quizBiblico/quizBiblico/musica/acerto.mp3",
  "/quizBiblico/quizBiblico/musica/errado.mp3",
  "/quizBiblico/quizBiblico/musica/fundo.mp3",

  // 🖼️ IMAGENS
  "/quizBiblico/quizBiblico/img/icon-192.png",
  "/quizBiblico/quizBiblico/img/icon-512.png"
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
      .then(response => {
        if (response) return response;

        return fetch(event.request).catch(() => {
          // 🔥 fallback offline
          if (event.request.mode === "navigate") {
            return caches.match("/quizBiblico/quizBiblico/index.html");
          }
        });
      })
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
