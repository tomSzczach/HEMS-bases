class Helipads {

    #helipads = []
    #views = []
    #mapRef = undefined;


    #initHelipads(helipadsData) {
        this.#helipads = helipadsData.map(helipadData => new Helipad(helipadData));
    }

    #initViews() {
        this.#views = this.#helipads.map(base => base.view);
    }

    #hideViews() {
        this.#views.forEach(view => this.#mapRef.removeLayer(view));
    }

    #showViews() {
        let areShown = LSProvider.get(LSProvider.keys.showingHelipads);
        if (areShown)
            this.#views.forEach(view => view.addTo(this.#mapRef));
    }


    constructor(mapRef) {
        this.#mapRef = mapRef;

        fetch('src/data/helipads.txt')
            .then(response => response.text())
            .then(encryptedData => decrypt(encryptedData))
            .then(data => this.#initHelipads(data))
            .then(() => this.#initViews())
            .then(() => this.#showViews());
    }


    show() {
        this.#showViews();
    }

    hide() {
        this.#hideViews();
    }
}
