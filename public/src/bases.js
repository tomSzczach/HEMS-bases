class Bases extends EventTarget {

    #bases = []
    #views = []
    #mapRef = undefined;
    #helipadsRef = undefined;


    #initBases(basesData) {
        this.#bases = basesData.map(baseData => new Base(baseData, this.#helipadsRef));
    }

    #updateViews() {
        this.#views = [];

        this.#bases.forEach(base => {
            let view = base.view;
            if (view !== undefined)
                this.#views.push(view);
        });
    }

    #hideViews() {
        this.#views.forEach(view => this.#mapRef.removeLayer(view));
    }

    #showViews() {
        let areShown = LSProvider.get(LSProvider.keys.showingBases);
        if (areShown)
            this.#views.forEach(view => view.addTo(this.#mapRef));
    }


    constructor(mapRef, helipadsRef) {
        super();
        this.#mapRef = mapRef;
        this.#helipadsRef = helipadsRef;

        fetch('src/data/basesInfo.txt')
            .then(response => response.text())
            .then(encryptedData => decrypt(encryptedData))
            .then(data => this.#initBases(data));
    }


    get missionsData() {
        return this.#bases
        .map(base => base.mission)
        .filter(mission => mission !== undefined);
    }


    update() {
        const updatePromises = this.#bases.map(base => base.update());
        Promise.all(updatePromises)
            .finally(() => this.dispatchEvent(new Event("bases-updated")))
            .finally(() => {
                this.#hideViews();
                this.#updateViews();
                setTimeout(() => 
                    this.#showViews(), 
                    300
                );
            }
        );
    }

    show() {
        this.#showViews();
    }

    hide() {
        this.#hideViews();
    }
}