const bases = new Bases();
const map = new Map();
const helipads = new Helipads(map.mapRef);
const timer = new Timer(LSProvider.get(LSProvider.keys.updateInterval));

timer.addEventListener("timer-update", () => bases.update().then(() => map.update(bases.bases)));