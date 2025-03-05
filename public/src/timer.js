class Timer extends EventTarget {

    #HTMLMinutes;
    #HTMLSeconds;
    #HTMLLastUpdate;
    #updateInterval;
    #time;
    #timerID;

    #dateOptions = { 
        year: 'numeric', 
        month: 'long', 
        weekday: 'long',
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    };


    #timer() {
        this.#HTMLMinutes.textContent = Math.floor(this.#time/60);
        this.#HTMLSeconds.textContent = (this.#time%60 >= 10) ? this.#time%60 : `0${this.#time%60}`;

        if (this.#time == 0) {
            this.dispatchEvent(new Event("timer-update"));
            this.#HTMLLastUpdate.textContent = new Date().toLocaleDateString('pl-PL', this.#dateOptions);
            this.#time = this.#updateInterval;
        } else {
            this.#time--;
        }
    }


    constructor(updateInterval) {
        super();
        this.#HTMLMinutes = document.getElementById("minutes");
        this.#HTMLSeconds = document.getElementById("seconds");
        this.#HTMLLastUpdate = document.getElementById("last-update");
        this.#updateInterval = parseInt(updateInterval);
        this.#time = 0;
        this.#timerID = setInterval(() => this.#timer(), 1000);;
    }


    setUpdateInterval(updateInterval) {
        this.#updateInterval = parseInt(updateInterval);
        this.#time = this.#updateInterval;
    }
}