const map = new Map();

const helipads = new Helipads(map.mapRef);
const bases = new Bases(map.mapRef, helipads);
const missions = new Missions(map.mapRef);
const voivodeships = new Voivodeships(map.mapRef);
const controlZones = new CTRs(map.mapRef);
const weatherRadar = new WeatherRadar(map.mapRef);

const timer = new Timer(LSProvider.get(LSProvider.keys.updateInterval));

timer.addEventListener("timer-update", () => {
    bases.update();
    weatherRadar.update();
});

bases.addEventListener("bases-updated", () => missions.update(bases.missionsData));
