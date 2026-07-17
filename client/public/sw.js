// Empty service worker stub — clears 404 from old SW registrations
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
