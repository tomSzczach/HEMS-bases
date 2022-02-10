let timerMinutes = document.getElementById("minutes");
let timerSeconds = document.getElementById("seconds");
const timeBetweenUpdates = 5*60; //in seconds
let time = timeBetweenUpdates;

let elementsColl = [];


fetch('src/dataSources.json')
  .then(response => response.json())
  .then(json => setInterval(Timer, 1000, json));

const Timer = (json) => {
    timerMinutes.textContent = Math.floor(time/60);
    timerSeconds.textContent = (time%60 >= 10) ? time%60 : `0${time%60}`;

    if(time % timeBetweenUpdates == 0){
        elementsColl.forEach(el => map.removeLayer(el));
        elementsColl = [];

        setTimeout(() => GetBase(json.bases), 500);
        time = timeBetweenUpdates;
    }

    time--;
}

const GetBase = (bases) => {
    bases.forEach(base => GetData(base));
}

const GetData = (base) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', base.url, true);
    xhr.send();
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200){
            let xml = xhr.responseXML.firstChild;
            let baseData = xml.querySelector('[Name="Bazy_HEMS"]');

            const data = {
                "lat": baseData.querySelector('[Name="LATITUDE"]').textContent,
                "long": baseData.querySelector('[Name="LONGITUDE"]').textContent,
                "airport": baseData.querySelector('[Name="AIRPORTNAME"]').textContent,
                "aircraftName": base.aircraftName,
                "flightViaLat": baseData.querySelector('[Name="DESTINATIONLATVIA"]').textContent,
                "flightViaLong": baseData.querySelector('[Name="DESTINATIONLONVIA"]').textContent,
                "flightToLat": baseData.querySelector('[Name="DESTINATIONLAT"]').textContent,
                "flightToLong": baseData.querySelector('[Name="DESTINATIONLON"]').textContent,
                "weatherStatus": baseData.querySelector('[Name="WEATHER"]').textContent,
                "weatherStatusDesc": baseData.querySelector('[Name="WEATHERSTATUSDESCRIPTION"]').textContent,
                "hemsStatus": baseData.querySelector('[Name="STATUS"]').textContent,
                "hemsStatusDesc": baseData.querySelector('[Name="HEMSSTATUSDESCRIPTION"]').textContent
            };

            ShowData(data);
        }
    }
}

const ShowData = (data) => {

    if( data.hemsStatus == "2"  ||
        data.hemsStatus == "3" ||
        data.hemsStatus == "4" ||
        data.hemsStatus == "5" ||
        data.hemsStatus == "6")
    {
        const polyline = L.polyline(
            [[data.lat, data.long], [data.flightViaLat, data.flightViaLong], [data.flightToLat, data.flightToLong]],
            {color: 'red'})
            .addTo(map);

        elementsColl.push(polyline);
    }
    
    const popup = L.popup({
        "autoClose": false,
        "autoPan": false,
        "closeButton": false,
        "closeOnClick": "",
        "closeOnEscapeKey": false,
        "className": `${StyleByHemsStatus(data.hemsStatus)} ${StyleByWeatherStatus(data.weatherStatus)}`
    })
    .setLatLng([data.lat, data.long])
    .setContent(`
        <p>${data.airport}</p>
        <p>${data.hemsStatusDesc}</p>
        <div class="aircraft-name">
            <img src="images/helicopter.jpg" alt="Helikopter:"><p>${data.aircraftName}</p>
        </div>
        <p class="weather-status">POGODA: ${data.weatherStatusDesc}</p>
    `)
    .openOn(map);

    elementsColl.push(popup);
}

const StyleByHemsStatus = (status) => {
    switch (status) {
        case "1": case "6":
            return "status-ready";   
        case "2": case "3": case "4": case "5":
            return "status-emergency";
        case "7":
            return "status-suspended";
        case "8":
            return "status-transport";
        case "9": case "10":
            return "status-closed";
        default:
            return "";
    }
}

const StyleByWeatherStatus = (status) => {
    switch (status) {
        case "0":
            return "weather-status-red";
        case "1":
            return "weather-status-yellow";
        case "2":
            return "weather-status-green";
        default:
            return "";
    }
}