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

        const helicopterVelocity = 240; // in km/h

        const baseCoords = L.latLng(baseLatitude, baseLongitude);
        const destCoords = L.latLng(destLatitude, destLongitude);

        const isViaPoint = viaLatitude && viaLongitude;

        if (isViaPoint) {
            const viaCoords = L.latLng(viaLatitude, viaLongitude);

            const distanceToVia = (baseCoords.distanceTo(viaCoords) / 1000).toFixed(0); // in km
            const distanceToDest = (parseFloat(distanceToVia) + (viaCoords.distanceTo(destCoords) / 1000)).toFixed(0); // in km
            const timeToVia = (distanceToVia / helicopterVelocity * 60).toFixed(0); // in minutes
            const timeToDest = (distanceToDest / helicopterVelocity * 60).toFixed(0); // in minutes

            const route = L.polyline([baseCoords, viaCoords, destCoords]);
            route.setStyle({ color: '#0000FF' });

            const viaMarker = this.#buildMarker(viaCoords, mission.viaInfo, distanceToVia, timeToVia);
            const destMarker = this.#buildMarker(destCoords, mission.destInfo, distanceToDest, timeToDest);

            return L.featureGroup()
                .addLayer(route)
                .addLayer(viaMarker)
                .addLayer(destMarker);
        }
        else {
            const distanceToDest = (baseCoords.distanceTo(destCoords) / 1000).toFixed(0); // in km
            const timeToDest = (distanceToDest / helicopterVelocity * 60).toFixed(0); // in minutes

            const route = L.polyline([baseCoords, destCoords]);
            route.setStyle({ color: '#FF0000' });

            const destMarker = this.#buildMarker(destCoords, mission.destInfo, distanceToDest, timeToDest);

            return L.featureGroup()
                .addLayer(route)
                .addLayer(destMarker);
        }
    }

    #buildMarker(coords, placeInfo, distance, time) {
        const { name, city, town, village, municipality, county } = placeInfo;
        const degN = coords.lat.toFixed(5);
        const degE = coords.lng.toFixed(5);

        return L
            .marker(coords)
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
    }

    #showViews() {
        let areShown = LSProvider.get(LSProvider.keys.showingMissions);
        if (areShown)
            this.#views.forEach(view => view.addTo(this.#mapRef));
    }

    async #getPlaceInfo([lat, lon]) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

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


    constructor(mapRef, helipadsRef) {
        this.#mapRef = mapRef;
        this.#helipadsRef = helipadsRef;
    }


    async update(missions) {
        this.#missions = await Promise.all(
            missions.map(async mission => {
                const isViaPoint = mission.viaLatitude && mission.viaLongitude;
                return {
                    ...mission,
                    viaInfo: isViaPoint ? await this.#getPlaceInfo([mission.viaLatitude, mission.viaLongitude]) : {},
                    destInfo: await this.#getPlaceInfo([mission.destLatitude, mission.destLongitude])
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
