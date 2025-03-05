class Base {
    
    #url = undefined;

    #isValid = false;

    #model = {
        city: undefined,
        aircraftName: undefined,
        shortName: undefined,
        baseLatitude: undefined,
        baseLongitude: undefined,
        viaLatitude: undefined,
        viaLongitude: undefined,
        destLatitude: undefined,
        destLongitude: undefined,
        hemsStatus: undefined,
        hemsStatusDescirption: undefined
    };


    #fetchData() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', this.#url, true);
            xhr.send();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) 
                {
                    if (xhr.status === 200) 
                    {
                        let xml = xhr.responseXML.firstChild;
                        let data = xml.querySelector('[Name="Bazy_HEMS"]');
                        resolve(data);
                    }
                    else 
                    {
                        reject(new Error(`Request failed with status: ${xhr.status}`));
                    }
                }
            };
        });
    }

    #validateCoord(value) {
        return (isNaN(value) || value === 0) ? undefined : value;
    }

    #updateData(data) {
        if (data)
        {
            this.#model.baseLatitude = this.#validateCoord(parseFloat(data.querySelector('[Name="LATITUDE"]').textContent));
            this.#model.baseLongitude = this.#validateCoord(parseFloat(data.querySelector('[Name="LONGITUDE"]').textContent));
            this.#model.viaLatitude = this.#validateCoord(parseFloat(data.querySelector('[Name="DESTINATIONLATVIA"]').textContent));
            this.#model.viaLongitude = this.#validateCoord(parseFloat(data.querySelector('[Name="DESTINATIONLONVIA"]').textContent));
            this.#model.destLatitude = this.#validateCoord(parseFloat(data.querySelector('[Name="DESTINATIONLAT"]').textContent));
            this.#model.destLongitude = this.#validateCoord(parseFloat(data.querySelector('[Name="DESTINATIONLON"]').textContent));
            this.#model.hemsStatus = data.querySelector('[Name="STATUS"]').textContent;
            this.#model.hemsStatusDescirption = data.querySelector('[Name="HEMSSTATUSDESCRIPTION"]').textContent;
            this.#isValid = true;
        }
        else
        {
            this.#isValid = false;
        }
    }


    constructor(baseInfo) {
        this.#url = baseInfo.url;

        this.#model.city = baseInfo.city;
        this.#model.aircraftName = baseInfo.aircraftName;
        this.#model.shortName = baseInfo.aircraftName.replace(/Ratownik (\d+)/, 'R-$1');
    }


    get mission() {
        const { destLatitude, destLongitude } = this.#model;

        return (destLatitude && destLongitude) ? 
            {
                shortName: this.#model.shortName,
                baseLatitude: this.#model.baseLatitude,
                baseLongitude: this.#model.baseLongitude,
                viaLatitude: this.#model.viaLatitude,
                viaLongitude: this.#model.viaLongitude,
                destLatitude: this.#model.destLatitude,
                destLongitude: this.#model.destLongitude
            }
        : undefined;
    }

    get view() {
        if (!this.#isValid)
            return undefined;

        const { shortName, baseLatitude, baseLongitude, hemsStatus } = this.#model;

        return L.marker()
                .setLatLng([baseLatitude, baseLongitude])
                .setOpacity(0.89)
                .setIcon(
                    L.divIcon({
                        html:
                            `<div class="content-box status-${hemsStatus}">
                                <div class="base-name">
                                    <p>${shortName}</p>
                                </div>
                                <div class="base-status">
                                    <p>${(hemsStatus) ? hemsStatus : "b.d." }</p>
                                </div>
                            </div>`,
                        iconSize: [40, 40],
                        className: "base-marker"
                    })
                );
    }


    update() {
        return this.#fetchData()
            .then(data => this.#updateData(data))
            .catch(err => {
                console.error(err);
                this.#isValid = false;
            });       
    }
}