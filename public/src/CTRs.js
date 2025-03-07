class CTRs {

    #view = undefined;
    #mapRef = undefined;


    #createView(data) {
        this.#view = L.geoJSON(data, {
            style: {
                color: "black",
                weight: 1,
                fillColor: "red",
                opacity: 0.55
            }
        });
    }

    #hideView() {
        this.#mapRef.removeLayer(this.#view);
    }

    #showView() {
        let areShown = LSProvider.get(LSProvider.keys.showingCTRs);
        if (areShown)
            this.#view?.addTo(this.#mapRef);
    }


    constructor(mapRef) {
        this.#mapRef = mapRef;

        fetch('src/data/controlZones.txt')
            .then(response => response.text())
            .then(encryptedData => decrypt(encryptedData))
            .then(data => this.#createView(data))
            .then(() => this.#showView());
    }


    show() {
        this.#showView();
    }

    hide() {
        this.#hideView();
    }

}
