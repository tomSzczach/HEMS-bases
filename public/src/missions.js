class Missions {

    #missions = []
    #views = []
    #mapRef = undefined;
    #helipadsRef = undefined;


    #hideViews() {
        this.#views.forEach(view => this.#mapRef.removeLayer(view));
    }

    #updateViews() {
        this.#views = this.#missions.map(mission => this.#createView(mission));
    }

    #createView(mission) {
        const { baseLatitude, baseLongitude, viaLatitude, viaLongitude, destLatitude, destLongitude } = mission;
        const { name, city, town, village, municipality, county } = mission.destInfo;

        const missionView = L.featureGroup();
        const baseCoords = L.latLng(baseLatitude, baseLongitude);
        const viaCoords = L.latLng(viaLatitude, viaLongitude);
        const destCoords = L.latLng(destLatitude, destLongitude);

        const isViaPoint = viaLatitude && viaLongitude;
        const viewColor = isViaPoint ? '#0000FF' : '#FF0000';

        const degN = destLatitude.toFixed(5);
        const degE = destLongitude.toFixed(5);

        const distance = (baseCoords.distanceTo(destCoords) / 1000).toFixed(0); // in km
        const speed = 240; // in km/h
        const time = (distance / speed * 60).toFixed(0); // in minutes

        const route = (isViaPoint)
            ? L.polyline([baseCoords, viaCoords, destCoords])
            : L.polyline([baseCoords, destCoords]);

        route.setStyle({ color: viewColor });
        
        const destMarker = L
            .circleMarker(destCoords, {
                radius: 5,
                color: viewColor,
                fillColor: viewColor,
                fillOpacity: 1
            })
            .bindPopup(
                L.popup({
                    "closeButton": false,
                    "className": "destination-popup"
                }).setContent(`
                    <div>
                        <div class="popup-header">
                            <p>Cel:</p>
                        </div>
                        <div class="popup-content">
                            <p class="coords">${degN}°N, ${degE}°E</p>
                            <p>${city || town || village || municipality || county}${name ? ` (${name})` : ''}</p>
                        </div>
                        <div class="popup-header">
                            <p>Dystans:</p>
                        </div>
                        <div class="popup-content">
                            <p>~ ${distance} km</p>
                        </div>
                        <div class="popup-header">
                            <p>Czas przelotu:</p>
                        </div>
                        <div class="popup-content">
                            <p>~ ${time} min</p>
                        </div>                        
                    </div>
                `)
            );

        missionView
            .addLayer(route)
            .addLayer(destMarker);

        return missionView;
    }

    #showViews() {
        let areShown = LSProvider.get(LSProvider.keys.showingMissions);
        if (areShown)
            this.#views.forEach(view => view.addTo(this.#mapRef));
    }

    async #getDestinationInfo([destLat, destLon]) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${destLat}&lon=${destLon}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            const { name } = data;
            const { city, town, village, municipality, county } = data.address;
            return { name, city, town, village, municipality, county };
        } catch (error) {
            console.error("Error fetching location data:", error);
            return {};
        }
    }

    #findViaPoint(mission) {
        const possibleViaHelipads = this.#helipadsRef.placedAtLatitude(mission.viaLatitude);

        if (possibleViaHelipads.length === 0)
            return;

        const closestHelipad = possibleViaHelipads.reduce((closest, helipadCoords) => {
            const baseCoords = L.latLng(mission.baseLatitude, mission.baseLongitude);
            const distanceToHelipad = baseCoords.distanceTo(helipadCoords);

            if (!closest || distanceToHelipad < closest.distance) {
                return { helipadCoords, distance: distanceToHelipad };
            }

            return closest;
        }, null);

        if (closestHelipad) {
            mission.viaLatitude = closestHelipad.helipadCoords.lat;
            mission.viaLongitude = closestHelipad.helipadCoords.lng;
        } else {
            mission.viaLatitude = 0;
            mission.viaLongitude = 0;
        }
    }


    constructor(mapRef, helipadsRef) {
        this.#mapRef = mapRef;
        this.#helipadsRef = helipadsRef;
    }


    async update(missions) {

        missions.forEach(mission => {
            if (mission.viaLatitude !== undefined)
                this.#findViaPoint(mission)
        });

        this.#missions = await Promise.all(
            missions.map(async mission => {
                return {
                    ...mission,
                    destInfo: await this.#getDestinationInfo([mission.destLatitude, mission.destLongitude])
                };
            })
        );

        this.#hideViews();
        this.#updateViews();
        this.#showViews();
    }

    show() {
        this.#showViews();
    }

    hide() {
        this.#hideViews();
    }

}
