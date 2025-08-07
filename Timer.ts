// Timer.ts
export enum TimerMode {
  POMODORO = 'pomodoro',
  SHORT_BREAK = 'shortBreak',
  LONG_BREAK = 'longBreak',
}

type ModeChangeCallback = () => void;

export class Timer {
  private timerMode!: TimerMode;
  private pomodoroTimeMin = 25;
  private shortBreakTimeMin = 5;
  private longBreakTimeMin = 15;

  private timerText: HTMLElement;
  private progressBar: HTMLElement;

  private currentTimeSec = 0;
  private totalTimeSec = 0;
  private intervalID: number | null = null;

  private isRunning = false;
  private onAutoBreak = true;
  private pomodoroCount = 0;
  private onModeChange: ModeChangeCallback | null = null;

  constructor() {
    this.timerText = document.getElementById('timer-text')!;
    this.progressBar = document.getElementById('myBar')!;
    this.switchToPomodoro();
  }

  private minuteToSec(min: number): number {
    return min * 60;
  }

  getPomodoroTime(): number { return this.pomodoroTimeMin; }
  getShortBrkTime(): number { return this.shortBreakTimeMin; }
  getLongBrkTime(): number { return this.longBreakTimeMin; }
  getTimerMode(): TimerMode { return this.timerMode; }
  getPomodoroCount(): number { return this.pomodoroCount; }
  isTimerRunning(): boolean { return this.isRunning; }

  setOnModeChange(cb: ModeChangeCallback): void { this.onModeChange = cb; }
  setPomodoroTime(min: number): void { this.pomodoroTimeMin = min; }
  setShortBrkTime(min: number): void { this.shortBreakTimeMin = min; }
  setLongBrkTime(min: number): void { this.longBreakTimeMin = min; }
  setAutoBreak(enabled: boolean): void { this.onAutoBreak = enabled; }

  private setTimerText(): void {
    this.timerText.innerText = this.formatTime(this.currentTimeSec);
  }

  private updateProgressBar(): void {
    this.progressBar.style.width = `${(this.currentTimeSec / this.totalTimeSec) * 100}%`;
  }

  updateModeTime(): void {
    const elapsed = this.totalTimeSec - this.currentTimeSec;
    switch (this.timerMode) {
      case TimerMode.POMODORO:
        this.totalTimeSec = this.minuteToSec(this.pomodoroTimeMin);
        break;
      case TimerMode.SHORT_BREAK:
        this.totalTimeSec = this.minuteToSec(this.shortBreakTimeMin);
        break;
      case TimerMode.LONG_BREAK:
        this.totalTimeSec = this.minuteToSec(this.longBreakTimeMin);
        break;
    }
    this.currentTimeSec = this.isRunning
      ? Math.max(this.totalTimeSec - elapsed, 0)
      : this.totalTimeSec;
    this.setTimerText();
    this.updateProgressBar();
  }

  private setModeTime(minutes: number, mode: TimerMode): void {
    this.timerMode = mode;
    this.totalTimeSec = this.minuteToSec(minutes);
    this.currentTimeSec = this.totalTimeSec;
    this.setTimerText();
    this.updateProgressBar();
  }

  switchToPomodoro(): void {
    this.setModeTime(this.pomodoroTimeMin, TimerMode.POMODORO);
    this.clearTimer();
  }

  switchToShortBreak(): void {
    this.setModeTime(this.shortBreakTimeMin, TimerMode.SHORT_BREAK);
    this.clearTimer();
  }

  switchToLongBreak(): void {
    this.setModeTime(this.longBreakTimeMin, TimerMode.LONG_BREAK);
    this.clearTimer();
  }

  private formatTime(sec: number): string {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  private clearTimer(): void {
    if (this.intervalID !== null) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }
    this.isRunning = false;
  }

  private onTimerComplete(): void {
    if (this.timerMode === TimerMode.POMODORO) {
      this.pomodoroCount++;
      if (this.pomodoroCount % 4 === 0) this.switchToLongBreak();
      else this.switchToShortBreak();
    } else {
      this.switchToPomodoro();
    }
    this.onModeChange?.();
    this.start();
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.intervalID = window.setInterval(() => {
      if (this.currentTimeSec <= 0) {
        this.clearTimer();
        if (this.onAutoBreak) this.onTimerComplete();
      } else {
        this.currentTimeSec--;
        this.setTimerText();
        this.updateProgressBar();
      }
    }, 1000);
  }

  pause(): void {
    this.clearTimer();
  }

  reset(): void {
    this.clearTimer();
    switch (this.timerMode) {
      case TimerMode.POMODORO:
        this.setModeTime(this.pomodoroTimeMin, TimerMode.POMODORO);
        break;
      case TimerMode.SHORT_BREAK:
        this.setModeTime(this.shortBreakTimeMin, TimerMode.SHORT_BREAK);
        break;
      case TimerMode.LONG_BREAK:
        this.setModeTime(this.longBreakTimeMin, TimerMode.LONG_BREAK);
        break;
    }
  }
}