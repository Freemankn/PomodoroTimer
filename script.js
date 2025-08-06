let timer;
let timerui; // Timer instance

window.addEventListener("DOMContentLoaded", () => {
    timer  = new Timer()
    timerui = new TimerUI(timer);
});

