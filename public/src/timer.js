const options = document.getElementsByName('menu-update-option');
const timerMinutes = document.getElementById("minutes");
const timerSeconds = document.getElementById("seconds");


let timeToReset = 300;  // default = 5 min
let time = 0;
let timerID = 0;


const HandleOptionChange = (e) => {
    timeToReset = parseInt(e.target.value);
    time = timeToReset;
}

const Timer = () => {
    timerMinutes.textContent = Math.floor(time/60);
    timerSeconds.textContent = (time%60 >= 10) ? time%60 : `0${time%60}`;

    if(time == 0)
    {
        console.log("UpdateData()");
        time = timeToReset;
    }
    else
    {
        time--;
    }
}

// - - -

options.forEach(option => {
    option.addEventListener('change', HandleOptionChange);
});

timerID = setInterval(Timer, 1000);