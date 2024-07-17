class LSProvider {

    static #default = {
        "updateInterval": 300,
        "showingRoutes": true,
        "showingBases": true,
        "showingHelipads": true
    }

    static keys = {
        updateInterval: "updateInterval",
        showingRoutes: "showingRoutes",
        showingBases: "showingBases",
        showingHelipads: "showingHelipads"
    }

    static get(key) { 
        let value = localStorage.getItem(key);
        value ??= this.#default[key];

        switch (key) {
            case this.keys.updateInterval:
                value = parseInt(value);
                break;
            
            case this.keys.showingBases:
            case this.keys.showingRoutes:
            case this.keys.showingHelipads:
                value = (String(value).toLowerCase() === 'true');
                break;

            default:
                break;
        }

        return value;
    }

    static set(key, value) { 
        localStorage.setItem(key, value);
        this.#default[key] = value;
    }

}