class Missions {

    #missions = []
    #views = []
    #mapRef = undefined;


    #hideViews() {
        this.#views.forEach(view => this.#mapRef.removeLayer(view));
    }

    #updateViews() {
        this.#views = this.#missions.map(mission => this.#createView(mission));
    }

    #createView(mission) {
        const { baseLatitude, baseLongitude, destLatitude, destLongitude } = mission;
        return L.polyline([[baseLatitude, baseLongitude], [destLatitude, destLongitude]]);
    }

    #showViews() {
        let areShown = LSProvider.get(LSProvider.keys.showingRoutes);
        if (areShown)
            this.#views.forEach(view => view.addTo(this.#mapRef));
    }


    constructor(mapRef) {
        this.#mapRef = mapRef;
    }


    update(missions) {
        console.log(missions);
        this.#missions = missions;

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
