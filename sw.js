// ---- RACINES SUR LE TÉLÉPHONE : SERVICE SANS MÉMOIRE (n° 279, 03/10/2026) ----
// Ce service ne garde RIEN sur le téléphone : chaque page et la liste des livres viennent toujours du réseau,
// comme dans le navigateur (jamais une collection périmée). Il existe seulement pour que le téléphone
// reconnaisse le site comme une appli installable. Modèle : ancestria-web/site/public/sw.js.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {
  // rien : la requête suit son chemin normal (réseau)
});
// ---- FIN ----
