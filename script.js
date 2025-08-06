// script.js
window.addEventListener("DOMContentLoaded", () => {
    const t=new Timer();

    const start = document.getElementById("start-btn");
    start.addEventListener("click", ()=>{
        t.start();
    } );

    const pause = document.getElementById("pause-btn");
    pause.addEventListener("click", ()=>{
        t.pause();
    } );

    const reset = document.getElementById("reset-btn");
    reset.addEventListener("click", ()=>{
        t.reset();
    } );

    const pomodoro = document.getElementById("pomodoro-btn");
    const pomodoroInput = document.getElementById("pomodoro-input");

    const shortbreak = document.getElementById("shortbreak-btn");
    const shortbreakInput = document.getElementById("shortbreak-input");

    const longbreak = document.getElementById("longbreak-btn");
    const longbreakInput = document.getElementById("longbreak-input");
    
    function updateModeButtons(){
        [pomodoro, shortbreak, longbreak].forEach( btn => {
            btn.classList.remove("active");
        });

        switch (t.getTimerMode()) {
        case Timer.TimerMode.POMODORO:
            pomodoro.classList.add("active"); break;
        case Timer.TimerMode.SHORT_BREAK:
            shortbreak.classList.add("active"); break;
        default:
            longbreak.classList.add("active");
        }
    };

    pomodoro.addEventListener("click", () => {
        t.switchToPomodoro();
        updateModeButtons();
    });

    shortbreak.addEventListener("click", () => {
        t.switchToShortBrk();
        updateModeButtons();
    });

    longbreak.addEventListener("click", () => {
        t.switchToLongBrk();
        updateModeButtons();
    });

    function applyChanges(){
        t.setPomodoroTime(pomodoroInput.value);
        t.setShortBrkTime(shortbreakInput.value);
        t.setLongBrkTime(longbreakInput.value);
        t.updateModeTime();
    }

    const setting = document.getElementById("settings-btn");
    const popup = document.getElementById("popup");
    setting.addEventListener("click", () =>{
        popup.classList.add("show");
        document.getElementById("pomodoro-input").value = t.getPomodoroTime();
        document.getElementById("shortbreak-input").value = t.getShortBrkTime();
        document.getElementById("longbreak-input").value = t.getLongBrkTime();
    });

    const close = document.getElementById("close-btn");
    close.addEventListener("click", () =>{
        popup.classList.remove("show");
        applyChanges();
    });

    popup.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.classList.remove("show");
        applyChanges();
    }
    });

    document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        popup.classList.remove("show");
        applyChanges();
    }
    });

});