class LSProvider {

    static #default = {
        "updateInterval": 300,
        "showingMissions": true,
        "showingBases": true,
        "showingHelipads": true,
        "showingCTRs": true,
        "showingVoivodeships": true,
        "showingWeatherRadar": true
    }

    static keys = {
        updateInterval: "updateInterval",
        showingMissions: "showingMissions",
        showingBases: "showingBases",
        showingHelipads: "showingHelipads",
        showingCTRs: "showingCTRs",
        showingVoivodeships: "showingVoivodeships",
        showingWeatherRadar: "showingWeatherRadar"
    }

    static get(key) { 
        let value = localStorage.getItem(key);
        value ??= this.#default[key];

        switch (key) {
            case this.keys.updateInterval:
                value = parseInt(value);
                break;
            
            case this.keys.showingBases:
            case this.keys.showingMissions:
            case this.keys.showingHelipads:
            case this.keys.showingCTRs:
            case this.keys.showingVoivodeships:
            case this.keys.showingWeatherRadar:
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