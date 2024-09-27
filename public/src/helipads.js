class Helipads {

    #mapRef = undefined;
    #helipadsData = undefined;
    #helipads = [];
    #isShowed = LSProvider.get(LSProvider.keys.showingHelipads);

    #circleBorder = 2;
    #circleRadius = 13;
    #circleSize = (this.#circleRadius+this.#circleBorder)*2;


    #init(helipads) {
        this.#helipadsData = helipads;

        this.#helipads = helipads.map(helipad => {
            return L.marker(
                [helipad.latitude, helipad.longitude],
                {
                    icon: L.divIcon({
                        html:
                            `<svg viewBox="0 0 ${this.#circleSize} ${this.#circleSize}" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="${this.#circleSize/2}" cy="${this.#circleSize/2}" r="${this.#circleRadius}" stroke-width="${this.#circleBorder}"/>
                                <text x="50%" y="70%" text-anchor="middle">H</text>
                            </svg>`,
                        iconSize: [this.#circleSize, this.#circleSize],
                        popupAnchor: [0, -this.#circleRadius],
                        className: "helipad-marker"
                    }),
                    opacity: 0.55
                }
            )
            .setZIndexOffset(-1000)
            .bindPopup(
                L.popup({
                    "closeButton": false,
                    "className": "helipad-popup"
                }).setContent(`
                    <div>
                        <div class="popup-header">
                            <p>${helipad.code}</p>
                        </div>
                        <div class="popup-content">
                            <p>${helipad.name}</p>
                        </div>
                    </div>
                `)
            );
        });
    }

    #addOnMap() {
        this.#helipads.forEach(helipad => helipad.addTo(this.#mapRef));
    }

    #removeFromMap() {
        this.#helipads.forEach(helipad => this.#mapRef.removeLayer(helipad));
    }


    constructor(mapRef) {
        this.#mapRef = mapRef;

        fetch('src/helipads.txt')
            .then(response => response.text())
            .then(encryptedData => decrypt(encryptedData))
            .then(data => {
                this.#init(data.helipads);
                if (this.#isShowed === true) {
                    this.#addOnMap();
                }
            });
    }


    show() {
        if (this.#isShowed === false) {
            this.#isShowed = true;
            this.#addOnMap();
        }
    }

    hide() {
        if (this.#isShowed === true) {
            this.#isShowed = false;
            this.#removeFromMap();
        }
    }

    existsHelipadAtLocation(latitude, longitude) {
        const epsilon = 0.0001;

        return this.#helipadsData.some(helipad => {
            const areLatEqual = Math.abs(helipad.latitude - latitude) < epsilon;
            const areLongEqual = Math.abs(helipad.longitude - longitude) < epsilon;
            return areLatEqual && areLongEqual;
        });
    }

}