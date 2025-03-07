class Voivodeships {
    
    #mapRef = undefined;
    #view = undefined;


    #createView(data) {
        this.#view = L.geoJSON(data, {
            style: {
                color: "black",
                weight: 1,
                opacity: 0.34,
                fillOpacity: 0
            }
        });
    }

    #showView() {
        let areShown = LSProvider.get(LSProvider.keys.showingVoivodeships);
        if (areShown)
            this.#view?.addTo(this.#mapRef);
    }

    #hideView() {
        this.#mapRef.removeLayer(this.#view);
    }


    constructor(mapRef) {
        this.#mapRef = mapRef;

        fetch('libs/polska-geojson/wojewodztwa-medium.geojson')
            .then(response => response.json())
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
