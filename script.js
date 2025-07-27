// script.js

const time = 1 // in minutes
const t=new Timer(time);

t.setTimerText();

const start = document.getElementById("start-btn");
start.addEventListener("click", ()=>{
    t.start();
    if(t.timeDone()){
        alert("Time is up");
    }
} );

const pause = document.getElementById("pause-btn");
pause.addEventListener("click", ()=>{
    t.pause();
} );

const reset = document.getElementById("reset-btn");
reset.addEventListener("click", ()=>{
    t.reset();
} );