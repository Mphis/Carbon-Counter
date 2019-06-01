self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('first-app')
      .then(function(cache) {
        cache.addAll([
          'index.html',
          'app.css',
          'app.js'
        ])
      })
  );
  return self.clients.claim();
});

