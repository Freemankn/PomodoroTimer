// Timer.js
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
    #onAutoBreak = true;
    #pomodoroCount = 0;
    #onModeChange = null;



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
    
    
    
    minutetosec(minute){
        return minute*60;
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

    getPomodoroCount() {
        return this.#pomodoroCount;
    }

    isRunning() {
        return this.#isRunning;
    }


    // Setters

    setTimerText(){
        if (!this.#timerText) console.error("timerText is null");
        this.#timerText.innerText = this.formatTime(this.#currentTimeSec);
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

    setOnModeChange(callback) {
        this.#onModeChange = callback;
    }

    setAutoBreak(onAutoBreak){
        this.#onAutoBreak = onAutoBreak;
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
        this.#timerMode = mode;
        this.#currentTimeSec = this.#totalTimeSec = this.minutetosec(minutes);
        this.setTimerText();
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


    formatTime(seconds){
        const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${minutes}:${secs}`;
    }


    updateProgressBar(){
        this.#progressBar.style.width = (this.#currentTimeSec/this.#totalTimeSec*100)+"%";
    }

    clear(){
        clearInterval(this.#intervalID);
        this.#intervalID = null;
        this.#isRunning = false; 
    }

    onTimerComplete() {
    if (this.#timerMode === Timer.TimerMode.POMODORO) {
        this.#pomodoroCount++;
        console.log(this.#pomodoroCount)


        if (this.#pomodoroCount % 4 === 0) {
            this.switchToLongBrk();
        } else {
            this.switchToShortBrk();
        }
    } else {
        this.switchToPomodoro();
    }
    
    if (this.#onModeChange) {
        this.#onModeChange();
    }

      this.start(); // centralized auto-start here

 }

    start(){
        if (this.#isRunning) return; // Don't start if already running
        this.#isRunning = true;
        this.#intervalID = setInterval(() => {
            if (this.#currentTimeSec <= 0) {
                this.clear();
                if(this.#onAutoBreak){
                    this.onTimerComplete();
                }
            } else {
                this.#currentTimeSec--;
                this.setTimerText();
                this.updateProgressBar();
            }
        }, 1000);
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
