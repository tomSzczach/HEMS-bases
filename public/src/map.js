class Map {

    #map = null;
    #popups = [];
    #isPopupsShowed = true;


    #createPopup(base) {
        const { shortName, baseLatitude, baseLongitude, hemsStatusDescirption } = base.data;

        return L.popup({
            "autoClose": false,
            "autoPan": false,
            "closeButton": false,
            "closeOnClick": "",
            "closeOnEscapeKey": false,
            "className": ""
        })
        .setLatLng([baseLatitude, baseLongitude])
        .setContent(`
            <div>
                <div class="popup-header">
                    <img src="images/helicopter.png" alt="Helikopter:">
                    <p>${shortName}</p>
                </div>
                <p>${hemsStatusDescirption}</p>
            </div>
        `);
    }

    #createPopups(bases) {
        this.#popups = bases.map(base => this.#createPopup(base));
    }

    #addPopups() {
        if (this.#isPopupsShowed) {
            this.#popups.forEach(popup => popup.openOn(this.#map));
        }
    }

    #removePopups() {
        if (this.#isPopupsShowed) {
            this.#popups.forEach(popup => this.#map.removeLayer(popup));
        }
    }

    #deletePopups() {
        this.#popups = [];
    }


    constructor() {
        this.#map = L.map('map').setView([52, 19], 6);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoidGhvbWFzLTgzMSIsImEiOiJja3plYXk2bXgwZm9qMnducjNucG1idmdnIn0.T_DFgZuhUUTwkL7Eg3nwyw'
        }).addTo(this.#map);
    }


    update(bases) {
        this.#removePopups();
        this.#deletePopups();
        this.#createPopups(bases);
        setTimeout(() => this.#addPopups(), 300);
        
    }

    showBases() {
        this.#isPopupsShowed = true;
        this.#addPopups();
    }

    hideBases() {
        this.#removePopups();
        this.#isPopupsShowed = false;
    }
}







// const ShowData = (data) => {

//     if( data.hemsStatus == "2"  ||
//         data.hemsStatus == "3" ||
//         data.hemsStatus == "4" ||
//         data.hemsStatus == "5" ||
//         data.hemsStatus == "6")
//     {
//         let route = [[data.lat, data.long]];

//         if (data.flightViaLat != 0 && data.flightViaLong != 0)
//         {
//             route.push([data.flightViaLat, data.flightViaLong]);
//         }

//         if (data.flightToLat != 0 && data.flightToLong != 0)
//         {
//             route.push([data.flightToLat, data.flightToLong]);
//         }        

//         const polyline = L.polyline(
//             [route],
//             {color: 'red'})
//             .addTo(map);

//         elementsColl.push(polyline);
//     }
    
//     const popup = L.popup({
//         "autoClose": false,
//         "autoPan": false,
//         "closeButton": false,
//         "closeOnClick": "",
//         "closeOnEscapeKey": false,
//         "className": `${(data.missionType == "Transport miedzyszpitalny") ? "status-transport" : StyleByHemsStatus(data.hemsStatus)}`
//     })
//     .setLatLng([data.lat, data.long])
//     .setContent(`
//         <p>${data.airport}</p>
//         <p>${data.hemsStatusDesc}</p>
//         <p class="mission-type-desc">${data.missionType}</p>
//         <div class="aircraft-name">
//             <img src="images/helicopter.jpg" alt="Helikopter:"><p>${data.aircraftName}</p>
//         </div>
//         <p class="weather-status">POGODA: ${data.weatherStatusDesc}</p>
//     `)
//     .openOn(map);

//     elementsColl.push(popup);
// }

// const StyleByHemsStatus = (status) => {
//     switch (status) {
//         case "1": case "6":
//             return "status-ready";   
//         case "2": case "3": case "4": case "5":
//             return "status-emergency";
//         case "7":
//             return "status-suspended";
//         case "8":
//             return "status-transport";
//         case "9": case "10":
//             return "status-closed";
//         default:
//             return "";
//     }
// }