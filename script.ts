import { Timer } from './Timer.ts';
import { TimerUI } from './TimerUI.ts';

let timer: Timer;
let timerUI: TimerUI;

window.addEventListener('DOMContentLoaded', () => {
  timer = new Timer();
  timerUI = new TimerUI(timer);
  timer.setOnModeChange(() => timerUI.updateUI());
});