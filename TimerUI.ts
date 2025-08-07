// TimerUI.ts
import { Timer, TimerMode } from './Timer.ts';
import { SettingsManager, Settings } from './SettingsManager.ts';

export class TimerUI {
  private timer: Timer;
  private popup: HTMLElement;

  constructor(timer: Timer) {
    this.timer = timer;
    this.popup = document.getElementById('popup')!;
    this.init();
  }

  private init(): void {
    this.timer.setOnModeChange(() => this.updateUI());
    this.bindButtons();
    this.bindPopup();
    this.bindModeSwitching();
    this.loadSettings();
    this.restoreSettingsPopupInputs();

    setTimeout(() => {
      document.body.style.transition = 'background-color 0.6s ease';
    }, 100);
  }

  private applyThemeClass(mode: TimerMode): void {
    document.body.classList.remove('pomodoro', 'short-break', 'long-break');
    if (mode === TimerMode.POMODORO) document.body.classList.add('pomodoro');
    if (mode === TimerMode.SHORT_BREAK) document.body.classList.add('short-break');
    if (mode === TimerMode.LONG_BREAK) document.body.classList.add('long-break');
  }

  private bindButtons(): void {
    document.getElementById('start-pause-btn')!.addEventListener('click', () => this.startAndPause());
    document.getElementById('reset-btn')!.addEventListener('click', () => this.timer.reset());
    document.getElementById('save-btn')!.addEventListener('click', () => this.saveUserSettings());
    document.getElementById('default-btn')!.addEventListener('click', () => this.loadDefaultSettings());
    document.getElementById('autobreak-check')!.addEventListener('change', () => this.changeAutoBreak());
    document.getElementById('lightDarkMode-btn')!.addEventListener('click', () =>
      this.toggleDarkMode(!document.body.classList.contains('dark'))
    );
  }

  private toggleDarkMode(on: boolean): void {
    document.body.classList.toggle('dark', on);
    const icon = document.getElementById('lightDarkMode-btn')!;
    if (on) {
      icon.classList.replace('fa-sun', 'fa-moon');
      (icon as HTMLElement).style.color = '#4137ccff';
    } else {
      icon.classList.replace('fa-moon', 'fa-sun');
      (icon as HTMLElement).style.color = 'rgb(250, 15, 15)';
    }
  }

  private startAndPause(): void {
    const btn = document.getElementById('start-pause-btn')!;
    if (this.timer.isTimerRunning()) {
      this.timer.pause();
      btn.innerText = 'Start';
    } else {
      this.timer.start();
      btn.innerText = 'Pause';
    }
  }

  private changeAutoBreak(): void {
    const checkbox = document.getElementById('autobreak-check') as HTMLInputElement;
    this.timer.setAutoBreak(checkbox.checked);
  }

  private bindModeSwitching(): void {
    ['pomodoro-btn', 'shortbreak-btn', 'longbreak-btn'].forEach(id => {
      const btn = document.getElementById(id)!;
      btn.addEventListener('click', () => {
        if (id === 'pomodoro-btn') this.timer.switchToPomodoro();
        if (id === 'shortbreak-btn') this.timer.switchToShortBreak();
        if (id === 'longbreak-btn') this.timer.switchToLongBreak();
        this.updateUI();
        (document.getElementById('start-pause-btn')! as HTMLElement).innerText = 'Start';
      });
    });
  }

  private updateModeButtons(): void {
    const ids = ['pomodoro-btn', 'shortbreak-btn', 'longbreak-btn'];
    ids.forEach(id => document.getElementById(id)!.classList.remove('active'));
    const mode = this.timer.getTimerMode();
    if (mode === TimerMode.POMODORO) document.getElementById('pomodoro-btn')!.classList.add('active');
    if (mode === TimerMode.SHORT_BREAK) document.getElementById('shortbreak-btn')!.classList.add('active');
    if (mode === TimerMode.LONG_BREAK) document.getElementById('longbreak-btn')!.classList.add('active');
  }

  private bindPopup(): void {
    const settingBtn = document.getElementById('settings-btn')!;
    const closeBtn = document.getElementById('close-btn')!;

    settingBtn.addEventListener('click', () => {
      this.popup.classList.add('show');
      this.restoreSettingsPopupInputs();
    });

    closeBtn.addEventListener('click', () => {
      this.popup.classList.remove('show');
      this.applyChangesFromInputs();
    });

    this.popup.addEventListener('click', e => {
      if (e.target === this.popup) {
        this.popup.classList.remove('show');
        this.applyChangesFromInputs();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.popup.classList.remove('show');
        this.applyChangesFromInputs();
      }
    });
  }

  private loadSettings(): void {
    const saved = SettingsManager.load();
    this.timer.setPomodoroTime(saved.pomodoroTime);
    this.timer.setShortBrkTime(saved.shortBreakTime);
    this.timer.setLongBrkTime(saved.longBreakTime);
    this.timer.setAutoBreak(saved.onAutoBreak);
    this.toggleDarkMode(saved.darkMode);
    this.timer.reset();
    this.updateUI();
  }

  private loadDefaultSettings(): void {
    SettingsManager.clear();
    this.loadSettings();
    this.restoreSettingsPopupInputs();
  }

  private saveUserSettings(): void {
    const settings: Settings = {
      pomodoroTime: Number((document.getElementById('pomodoro-input') as HTMLInputElement).value),
      shortBreakTime: Number((document.getElementById('shortbreak-input') as HTMLInputElement).value),
      longBreakTime: Number((document.getElementById('longbreak-input') as HTMLInputElement).value),
      onAutoBreak: (document.getElementById('autobreak-check') as HTMLInputElement).checked,
      darkMode: document.body.classList.contains('dark'),
    };
    SettingsManager.save(settings);
    this.popup.classList.remove('show');
    this.applyChangesFromInputs();
    this.timer.reset();
    this.updateUI();
    (document.getElementById('start-pause-btn')! as HTMLElement).innerText = 'Start';
  }

  private applyChangesFromInputs(): void {
    const pomodoro = Number((document.getElementById('pomodoro-input') as HTMLInputElement).value);
    const shortBreak = Number((document.getElementById('shortbreak-input') as HTMLInputElement).value);
    const longBreak = Number((document.getElementById('longbreak-input') as HTMLInputElement).value);
    const onAutoBreak = (document.getElementById('autobreak-check') as HTMLInputElement).checked;
    this.timer.setPomodoroTime(pomodoro);
    this.timer.setShortBrkTime(shortBreak);
    this.timer.setLongBrkTime(longBreak);
    this.timer.setAutoBreak(onAutoBreak);
  }

  private restoreSettingsPopupInputs(): void {
    const saved = SettingsManager.load();
    (document.getElementById('pomodoro-input') as HTMLInputElement).value =
      this.timer.getPomodoroTime().toString();
    (document.getElementById('shortbreak-input') as HTMLInputElement).value =
      this.timer.getShortBrkTime().toString();
    (document.getElementById('longbreak-input') as HTMLInputElement).value =
      this.timer.getLongBrkTime().toString();
    (document.getElementById('autobreak-check') as HTMLInputElement).checked = saved.onAutoBreak;
  }

  updateUI(): void {
    this.updateModeButtons();
    this.applyThemeClass(this.timer.getTimerMode());
  }
}
