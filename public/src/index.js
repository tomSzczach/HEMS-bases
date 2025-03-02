const map = new Map();

const bases = new Bases(map.mapRef);
const helipads = new Helipads(map.mapRef);
const missions = new Missions(map.mapRef);
const voivodeships = new Voivodeships(map.mapRef);

const timer = new Timer(LSProvider.get(LSProvider.keys.updateInterval));
timer.addEventListener("timer-update", () => bases.update());

bases.addEventListener("bases-updated", () => missions.update(bases.missionsData));
