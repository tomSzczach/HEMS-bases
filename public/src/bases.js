class Bases {

    #bases = []


    #initBases(bases) {
        this.#bases = bases.map(base => new Base(base));
    }


    constructor() {
        fetch('src/basesInfo.json')
            .then(response => response.json())
            .then(data => this.#initBases(data.bases));
    }


    get bases() {
        return this.#bases;
    }


    update() {
        const updatePromises = this.#bases.map(base => base.update());
        return Promise.all(updatePromises);
    }
}