class Timer extends EventTarget {

    #HTMLMinutes;
    #HTMLSeconds;
    #updateInterval;
    #time;
    #timerID;


    #timer() {
        this.#HTMLMinutes.textContent = Math.floor(this.#time/60);
        this.#HTMLSeconds.textContent = (this.#time%60 >= 10) ? this.#time%60 : `0${this.#time%60}`;

        if (this.#time == 0) {
            this.dispatchEvent(new Event("timer-update"));
            this.#time = this.#updateInterval;
        } else {
            this.#time--;
        }
    }


    constructor(updateInterval) {
        super();
        this.#HTMLMinutes = document.getElementById("minutes");
        this.#HTMLSeconds = document.getElementById("seconds");
        this.#updateInterval = parseInt(updateInterval);
        this.#time = 0;
        this.#timerID = setInterval(() => this.#timer(), 1000);;
    }


    setUpdateInterval(updateInterval) {
        this.#updateInterval = parseInt(updateInterval);
        this.#time = this.#updateInterval;
    }
}