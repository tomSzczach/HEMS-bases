class Map {

    #map = null;
    #popups = [];
    #routes = [];
    #isPopupsShowed = true;
    #isRoutesShowed = true;


    #create(bases) {
        this.#createPopups(bases);
        this.#createRoutes(bases);
    }

    #add() {
        this.#addPopups();
        this.#addRoutes();
    }

    #remove() {
        this.#removePopups();
        this.#removeRoutes();
    }

    #delete() {
        this.#deletePopups();
        this.#deleteRoutes();
    }


    #createPopup(base) {
        const { shortName, baseLatitude, baseLongitude, hemsStatus, hemsStatusDescirption } = base.data;

        return L.popup({
            "autoClose": false,
            "autoPan": false,
            "closeButton": false,
            "closeOnClick": "",
            "closeOnEscapeKey": false,
            "className": ""
        })
        .setLatLng([baseLatitude, baseLongitude])
        .setContent(`
            <div>
                <div class="popup-header">
                    <p>${shortName}</p>
                    <img src="images/helicopter.png" alt="Helikopter:">
                </div>
                <p class="status-${hemsStatus}" >${(hemsStatusDescirption) ? hemsStatusDescirption : "b.d." }</p>
            </div>
        `);
    }

    #createPopups(bases) {
        this.#popups = bases.map(base => this.#createPopup(base));
    }

    #addPopups() {
        if (this.#popups.length && this.#isPopupsShowed) {
            this.#popups.forEach(popup => popup.openOn(this.#map));
        }
    }

    #removePopups() {
        if (this.#isPopupsShowed) {
            this.#popups.forEach(popup => this.#map.removeLayer(popup));
        }
    }

    #deletePopups() {
        this.#popups = [];
    }


    #createRoute(base) {
        const { baseLatitude, baseLongitude, viaLatitude, viaLongitude, destLatitude, destLongitude } = base.data;

        if (destLatitude && destLongitude)
        {
            return (viaLatitude && viaLongitude) ?
                L.polyline([[baseLatitude, baseLongitude], [viaLatitude, viaLongitude], [destLatitude, destLongitude]], {color: 'red'}) :
                L.polyline([[baseLatitude, baseLongitude], [destLatitude, destLongitude]], {color: 'red'});
        }

        return undefined;
    }

    #createRoutes(bases) {
        this.#routes = bases
            .map(base => this.#createRoute(base))
            .filter(route => route !== undefined);
    }

    #addRoutes() {
        if (this.#routes.length && this.#isRoutesShowed) {
            this.#routes.forEach(route => route.addTo(this.#map));
        }
    }

    #removeRoutes() {
        if (this.#isRoutesShowed) {
            this.#routes.forEach(route => this.#map.removeLayer(route));
        }
    }

    #deleteRoutes() {
        this.#routes = [];
    }


    constructor() {
        this.#map = L.map('map').setView([52, 19], 6);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoidGhvbWFzLTgzMSIsImEiOiJja3plYXk2bXgwZm9qMnducjNucG1idmdnIn0.T_DFgZuhUUTwkL7Eg3nwyw'
        }).addTo(this.#map);
    }


    update(bases) {
        this.#remove();
        this.#delete();
        this.#create(bases);
        setTimeout(() => this.#add(), 300);   
    }

    showBases() {
        this.#isPopupsShowed = true;
        this.#addPopups();
    }

    hideBases() {
        this.#removePopups();
        this.#isPopupsShowed = false;
    }

    showRoutes() {
        this.#isRoutesShowed = true;
        this.#addRoutes();
    }

    hideRoutes() {
        this.#removeRoutes();
        this.#isRoutesShowed = false;
    }
}
