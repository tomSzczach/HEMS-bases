class Helipad {

    #model = {
        type: undefined,
        code: undefined,
        name: undefined,
        latitude: undefined,
        longitude: undefined
    }


    constructor(helipadInfo) {
        this.#model.type = helipadInfo.type;
        this.#model.code = helipadInfo.code;
        this.#model.name = helipadInfo.name;
        this.#model.latitude = helipadInfo.latitude;
        this.#model.longitude = helipadInfo.longitude;
    }


    get coordinates() {
        return L.latLng(this.#model.latitude, this.#model.longitude);
    }

    get view() {
        const { latitude, longitude, code, name } = this.#model;

        const circleBorder = 2;
        const circleRadius = 13;
        const circleSize = (circleRadius+circleBorder)*2;

        return L.marker(
                [latitude, longitude],
                {
                    icon: L.divIcon({
                        html:
                            `<svg viewBox="0 0 ${circleSize} ${circleSize}" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="${circleSize/2}" cy="${circleSize/2}" r="${circleRadius}" stroke-width="${circleBorder}"/>
                                <text x="50%" y="70%" text-anchor="middle">H</text>
                            </svg>`,
                        iconSize: [circleSize, circleSize],
                        popupAnchor: [0, -circleRadius],
                        className: "helipad-marker"
                    }),
                    opacity: 0.55
                })
                .setZIndexOffset(-1000)
                .bindPopup(
                    L.popup({
                        "closeButton": false,
                        "className": "helipad-popup"
                    }).setContent(`
                        <div>
                            <div class="popup-header">
                                <p>${code}</p>
                            </div>
                            <div class="popup-content">
                                <p>${name}</p>
                            </div>
                        </div>
                    `)
                );
    }

}