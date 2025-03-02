class Voivodeships {
    
    #mapRef = undefined;
    #view = undefined;

    
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
            .then(data => {
                this.#view = L.geoJSON(data, {
                    style: {
                        color: "black",
                        weight: 1,
                        opacity: 0.34,
                        fillOpacity: 0
                    }
                });
                this.#view.addTo(this.#mapRef);
            });
    }


    show() {
        this.#showView();
    }

    hide() {
        this.#hideView();
    }
    
}
