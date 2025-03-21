class Map {

    #map = undefined;

    #setInitialZoom() {
        const screenWidth = window.innerWidth;

        if (screenWidth <= 600) {
            return 6;
        } else {
            return 7;
        }
    }


    constructor() {
        this.#map = L.map('map').setView([52.2, 19], this.#setInitialZoom());

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoidGhvbWFzLTgzMSIsImEiOiJja3plYXk2bXgwZm9qMnducjNucG1idmdnIn0.T_DFgZuhUUTwkL7Eg3nwyw'
        }).addTo(this.#map);
    }


    get mapRef() {
        return this.#map;
    }
}
