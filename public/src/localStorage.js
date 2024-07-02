class LSProvider {

    static #default = {
        "updateInterval": 300,
        "showingRoutes": true,
        "showingBases": true
    }

    static keys = {
        updateInterval: "updateInterval",
        showingRoutes: "showingRoutes",
        showingBases: "showingBases"
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