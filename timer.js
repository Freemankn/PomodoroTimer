// timer.js
class Timer{
    #pomodoroTime;
    #currentTime; 
    #totalTime;
    #intervalID;
    #timerText= document.getElementById("timer-text");
    #progressBar = document.getElementById("myBar");

    minutetosec(minute){
        return minute*60;
    }

    constructor(time){ // currentTime is in minutes
        this.#currentTime = this.#pomodoroTime = this.#totalTime = this.minutetosec(time);
    }

    setTimerText(){
        this.#timerText.innerText = this.formatTime(this.#currentTime*1000);
    }

    formatTime(ms){
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
    }

    // timeDone(){
    //     return this.#isDone;
    // }

    minutetosec(minute){
        return minute*60;
    }

    updateProgressBar(){
        this.#progressBar.style.width = (this.#currentTime/this.#totalTime*100)+"%";
        this.setTimerText();
    }

    start(){
        this.#intervalID = setInterval( () =>
        {
            this.updateProgressBar();
            this.#currentTime--;
            if(this.#currentTime <0){
                clearInterval(this.#intervalID); 
                // this.#isDone = true;
                alert("Time is up");
            }
        },1000);
    }

    pause(){
        clearInterval(this.#intervalID);
    }

    reset(){
        this.#currentTime = this.#pomodoroTime;
        this.#totalTime = this.#pomodoroTime;
        clearInterval(this.#intervalID);
        this.updateProgressBar();
    }

}

