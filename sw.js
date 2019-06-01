'use strict';

self.importScripts(
);

const version = "1.03",
    preCache = "PRECACHE-" + version,
    dynamicCache = "DYNAMIC-" + version,
    cacheList = [
        "/",
        "index.html",
        "install.js",
        "app.js",
        "app.css",
    ];

/*  Service Worker Event Handlers */

self.addEventListener("install", event => {

    self.skipWaiting();

    console.log("Installing the service worker!");

    caches.open(preCache)
        .then(function (cache) {

            cache.addAll(cacheList);

        });

});

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(cacheNames => {
          cacheNames.forEach(value => {
    
            if (value.indexOf(version) < 0) {
              caches.delete(value);
            }
    
          });
    
          console.log("service worker activated");
    
          return;
    
        })
    
      );
    
});

self.addEventListener("fetch", event => {

    event.respondWith(
        caches.match(event.request)
            .then(function (response) {

                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then(response => {

                        if (response.ok || response.status === 0) {

                            //I have no clue why the chrome extensions requests are passed through the SW
                            //but I don't like the error messages in the console ;)
                            if (event.request.url.indexOf("chrome-extension") === -1) {

                                let copy = response.clone();

                                //if it was not in the cache it must be added to the dynamic cache
                                caches.open(dynamicCache)
                                    .then(cache => {
                                        cache.put(event.request, copy);
                                    });

                            }

                            return response;

                        }

                    }).catch(err => {

                        if (err.message === "Failed to fetch") {

                            if (event.request.url.indexOf("session") > -1) {

                                return renderSession(event);

                            }

                        }

                    });
            })
    );

});
