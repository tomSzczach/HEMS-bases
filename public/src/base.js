class Base {
    
    #city = "";
    #aircraftName = "";
    #shortName = "";
    #url = "";
    #baseLatitude = 0.0;
    #baseLongitude = 0.0;
    #viaLatitude = 0.0;
    #viaLongitude = 0.0;
    #destLatitude = 0.0;
    #destLongitude = 0.0;
    #hemsStatusDescirption = "";


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

    #updateData(data) {
        if (data)
        {
            this.#baseLatitude = parseFloat(data.querySelector('[Name="LATITUDE"]').textContent);
            this.#baseLongitude = parseFloat(data.querySelector('[Name="LONGITUDE"]').textContent);
            this.#viaLatitude = parseFloat(data.querySelector('[Name="DESTINATIONLATVIA"]').textContent);
            this.#viaLongitude = parseFloat(data.querySelector('[Name="DESTINATIONLONVIA"]').textContent);
            this.#destLatitude = parseFloat(data.querySelector('[Name="DESTINATIONLAT"]').textContent);
            this.#destLongitude = parseFloat(data.querySelector('[Name="DESTINATIONLON"]').textContent);
            this.#hemsStatusDescirption = data.querySelector('[Name="HEMSSTATUSDESCRIPTION"]').textContent;
        }
    }


    constructor(baseInfo) {
        this.#city = baseInfo.city;
        this.#aircraftName = baseInfo.aircraftName;
        this.#shortName = baseInfo.aircraftName.replace(/Ratownik (\d+)/, 'R-$1');
        this.#url = baseInfo.url;
    }


    get data() {
        return {
            aircraftName: this.#aircraftName,
            shortName: this.#shortName,
            baseLatitude: this.#baseLatitude,
            baseLongitude: this.#baseLongitude,
            hemsStatusDescirption: this.#hemsStatusDescirption
        }
    }


    update() {
        return this.#fetchData()
            .then(data => this.#updateData(data))
            .catch(err => console.error(err));       
    }
}