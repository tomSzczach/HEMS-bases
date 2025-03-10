class WeatherRadar {

    #mapRef = undefined;
    #view = undefined;
    #lastRadarImageDate = undefined;


    #updateView(radarImageDate) {
        const radarImageUrl = `https://danepubliczne.imgw.pl/pl/datastore/getfiledown/Oper/Polrad/Produkty/POLCOMP/COMPO_CMAX_250.comp.cmax/${radarImageDate}0000dBZ.cmax_echoOnly.png`;
        
        const imageBounds = [
            [48.134643, 11.810374],  // Bottom-left (South-West), 
            [56.185658, 25.153389]  // Top-right (North-East), 
        ];

        const styles = {
            opacity: 0.34
        };

        this.#view = L.imageOverlay(radarImageUrl, imageBounds, styles);
    }

    #showView() {
        let areShown = LSProvider.get(LSProvider.keys.showingWeatherRadar);
        if (areShown)
            this.#view?.addTo(this.#mapRef);
    }

    #hideView() {
        if (this.#view)
            this.#mapRef.removeLayer(this.#view);
    }

    #getFormattedDate() {
        const now = new Date();

        // Add delay to be sure that new image is already available
        now.setMinutes(now.getMinutes() - 6);

        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        
        // Minutes are rounded to the nearest 10 (00, 10, 20, ..., 50)
        const roundedMinutes = Math.floor(now.getUTCMinutes() / 10) * 10;
        const minutes = String(roundedMinutes).padStart(2, '0');
    
        return `${year}${month}${day}${hours}${minutes}`;
    }


    constructor(mapRef) {
        this.#mapRef = mapRef;
    }


    update() {
        const radarImageDate = this.#getFormattedDate();
        if (radarImageDate === this.#lastRadarImageDate)
            return;

        this.#hideView();
        this.#updateView(radarImageDate);
        this.#showView();

        this.#lastRadarImageDate = radarImageDate;
    }

    show() {
        this.#showView();
    }

    hide() {
        this.#hideView();
    }

}