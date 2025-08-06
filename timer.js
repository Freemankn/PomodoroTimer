// timer.js
class Timer{

    static TimerMode = Object.freeze({
    POMODORO: "pomodoro",
    SHORT_BREAK: "shortBreak",
    LONG_BREAK: "longBreak"});
    #timerMode;

    #pomodoroTimeMin;
    #shortBreakTimeMin;
    #longBreakTimeMin;
    #timerText;
    #progressBar;

    #currentTimeSec; 
    #totalTimeSec;
    #intervalID;

    
    #isRunning = false;
    
    minutetosec(minute){
        return minute*60;
    }

    constructor(){
    // Step 1: Default config values
    this.#pomodoroTimeMin= 25;
    this.#shortBreakTimeMin = 5;
    this.#longBreakTimeMin = 15;

    // Step 2: DOM element refs
    this.#timerText = document.getElementById("timer-text");
    this.#progressBar = document.getElementById("myBar");

    // Step 3: Initial mode
    this.switchToPomodoro();
    } 

    // Getters

    getPomodoroTime(){
        return this.#pomodoroTimeMin;  
    }

    getShortBrkTime(){
        return this.#shortBreakTimeMin;  
    }

    getLongBrkTime(){
        return this.#longBreakTimeMin;
    }

    getTimerMode(){
        return this.#timerMode;
    }


    // Setters

    setTimerText(){
        if (!this.#timerText) console.error("timerText is null");
        this.#timerText.innerText = this.formatTime(this.#currentTimeSec*1000);
    }

    setPomodoroTime(minutes){
        this.#pomodoroTimeMin = minutes;
    }

    setLongBrkTime(minutes){
        this.#longBreakTimeMin = minutes;
    }

    setShortBrkTime(minutes){
        this.#shortBreakTimeMin = minutes;
    }

    updateModeTime(){
        // 1. Store elapsed time
        const elapsedTime = this.#totalTimeSec - this.#currentTimeSec;

        // 2. Update total time based on mode
        switch (this.#timerMode) {
            case Timer.TimerMode.POMODORO:
                this.#totalTimeSec = this.minutetosec(this.#pomodoroTimeMin); break;
            case Timer.TimerMode.SHORT_BREAK:
                this.#totalTimeSec = this.minutetosec(this.#shortBreakTimeMin); break;
            default:
                this.#totalTimeSec = this.minutetosec(this.#longBreakTimeMin); break;
        }
        
        // 3. If running, preserve elapsed time proportionally
        if (this.#isRunning){
            this.#currentTimeSec = Math.max(this.#totalTimeSec - elapsedTime, 0);
        }else{
            this.#currentTimeSec = this.#totalTimeSec;
        }

        // 4. Update UI
        this.setTimerText();
        this.updateProgressBar();
    }
    

    // Setting the time for Mode

    setModeTime(minutes, mode){
        this.#currentTimeSec = this.#totalTimeSec = this.minutetosec(minutes);
        this.setTimerText();
        this.#timerMode = mode;
        this.updateProgressBar();
    }

    // Switching Modes

    switchToPomodoro(){
        this.setModeTime(this.#pomodoroTimeMin, Timer.TimerMode["POMODORO"]);
        this.clear();
    }

   
    switchToShortBrk(){
        this.setModeTime(this.#shortBreakTimeMin, Timer.TimerMode["SHORT_BREAK"]);
        this.clear();
    }

    switchToLongBrk(){
        this.setModeTime(this.#longBreakTimeMin, Timer.TimerMode["LONG_BREAK"]);
        this.clear();
    }


    formatTime(ms){
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
    }

    updateProgressBar(){
        this.#progressBar.style.width = (this.#currentTimeSec/this.#totalTimeSec*100)+"%";
        this.setTimerText();
    }

    clear(){
        clearInterval(this.#intervalID);
        this.#isRunning = false; 
    }

    start(){
        if (this.#isRunning) return; // Don't start if already running
        this.#isRunning = true;
        this.#intervalID = setInterval( () =>
        {
            this.updateProgressBar();
            this.#currentTimeSec--;
            if(this.#currentTimeSec <0){
                this.clear(); 
                alert("Time is up");
            }
        },1000);
    }

    pause(){
        this.clear();
    }

    reset(){
    this.clear();
    switch (this.#timerMode) {
        case Timer.TimerMode.POMODORO:
            this.setModeTime(this.#pomodoroTimeMin, Timer.TimerMode.POMODORO); break;
        case Timer.TimerMode.SHORT_BREAK:
            this.setModeTime(this.#shortBreakTimeMin, Timer.TimerMode.SHORT_BREAK); break;
        default:
            this.setModeTime(this.#longBreakTimeMin, Timer.TimerMode.LONG_BREAK);
        }
    }
}
