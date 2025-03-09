class Base {
    
    #url = undefined;

    #helipadsRef = undefined;

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
        hemsStatusDescirption: undefined,
        weatherStatus: undefined
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
            this.#model.weatherStatus = data.querySelector('[Name="WEATHER"]').textContent;

            if (this.#model.viaLatitude !== undefined) {
                this.#findViaPoint();
            }

            this.#isValid = true;
        }
        else
        {
            this.#isValid = false;
        }
    }

    #findViaPoint() {
        const possibleViaHelipads = this.#helipadsRef.placedAtLatitude(this.#model.viaLatitude);
        const baseCoords = L.latLng(this.#model.baseLatitude, this.#model.baseLongitude);

        if (possibleViaHelipads.length === 0)
            return;

        const closestHelipad = possibleViaHelipads.reduce((closest, helipadCoords) => {
            const distanceToHelipad = baseCoords.distanceTo(helipadCoords);

            if (!closest || distanceToHelipad < closest.distance) {
                return { helipadCoords, distance: distanceToHelipad };
            }

            return closest;
        }, null);

        if (closestHelipad) {
            this.#model.viaLatitude = closestHelipad.helipadCoords.lat;
            this.#model.viaLongitude = closestHelipad.helipadCoords.lng;
        } else {
            this.#model.viaLatitude = undefined;
            this.#model.viaLongitude = undefined;
        }
    }


    constructor(baseInfo, helipadsRef) {
        this.#url = baseInfo.url;

        this.#helipadsRef = helipadsRef;

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

        const { shortName, baseLatitude, baseLongitude, viaLatitude, viaLongitude, hemsStatus, weatherStatus } = this.#model;

        const isViaPoint = viaLatitude && viaLongitude;
 
        return L.marker()
                .setLatLng([baseLatitude, baseLongitude])
                .setIcon(
                    L.divIcon({
                        html: `
                            <div class="container">
                                <div class="outer-box weather-status-${weatherStatus}">
                                    <div class="inner-box hems-status-${isViaPoint ? 'transport' : hemsStatus}">
                                        <div class="img-box">
                                            <img src="images/helicopter-icon.png" alt="helicopter icon" />
                                        </div>
                                    </div>
                                </div>
                                <div class="badge">
                                    <div class="base-name">
                                        ${shortName}
                                    </div>
                                    <div class="base-status hems-status-${hemsStatus}">
                                        ${(hemsStatus) ? hemsStatus : "b.d." }
                                    </div>
                                </div>
                            </div>
                        `,
                        iconSize: [55, 55],
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
