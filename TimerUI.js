class TimerUI {
  #timer;
  #popup

  constructor(timer) {
    this.#timer = timer;
    this.#popup = document.getElementById("popup");
    this.init();
  }

  init() {
    this.bindButtons();
    this.bindPopup();
    this.bindModeSwitching();
    this.loadSettings();
    this.restoreSettingsPopupInputs();
  }

  // === 🎛️ Buttons ===
  bindButtons() {
    document.getElementById("start-btn").addEventListener("click", () => this.#timer.start());
    document.getElementById("pause-btn").addEventListener("click", () => this.#timer.pause());
    document.getElementById("reset-btn").addEventListener("click", () => this.#timer.reset());
    document.getElementById("save-btn").addEventListener("click", () => this.saveUserSettings());
  }

  // === ⏱️ Mode Switching ===
  bindModeSwitching() {
    const pomodoro = document.getElementById("pomodoro-btn");
    const shortbreak = document.getElementById("shortbreak-btn");
    const longbreak = document.getElementById("longbreak-btn");

    pomodoro.addEventListener("click", () => {
      this.#timer.switchToPomodoro();
      this.updateModeButtons();
    });

    shortbreak.addEventListener("click", () => {
      this.#timer.switchToShortBrk();
      this.updateModeButtons();
    });

    longbreak.addEventListener("click", () => {
      this.#timer.switchToLongBrk();
      this.updateModeButtons();
    });
  }

  updateModeButtons() {
    const pomodoro = document.getElementById("pomodoro-btn");
    const shortbreak = document.getElementById("shortbreak-btn");
    const longbreak = document.getElementById("longbreak-btn");

    [pomodoro, shortbreak, longbreak].forEach(btn => btn.classList.remove("active"));

    switch (this.#timer.getTimerMode()) {
      case Timer.TimerMode.POMODORO:
        pomodoro.classList.add("active");
        break;
      case Timer.TimerMode.SHORT_BREAK:
        shortbreak.classList.add("active");
        break;
      case Timer.TimerMode.LONG_BREAK:
        longbreak.classList.add("active");
        break;
    }
  }

  // === ⚙️ Settings Popup ===
  bindPopup() {
    const setting = document.getElementById("settings-btn");
    const close = document.getElementById("close-btn");

    setting.addEventListener("click", () => {
      this.#popup.classList.add("show");
      this.restoreSettingsPopupInputs();
    });

    close.addEventListener("click", () => {
      this.#popup.classList.remove("show");
      this.applyChangesFromInputs();
    });

    popup.addEventListener("click", (e) => {
      if (e.target === popup) {
        this.#popup.classList.remove("show");
        this.applyChangesFromInputs();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.#popup.classList.remove("show");
        this.applyChangesFromInputs();
      }
    });
  }

  // === 💾 LocalStorage ===
  loadSettings() {
    const saved = SettingsManager.load();
    if (!saved) return;

    this.#timer.setPomodoroTime(saved.pomodoroTime);
    this.#timer.setShortBrkTime(saved.shortBreakTime);
    this.#timer.setLongBrkTime(saved.longBreakTime);
    this.#timer.updateModeTime();
  }

  saveUserSettings() {
    const settings = {
      pomodoroTime: Number(document.getElementById("pomodoro-input").value),
      shortBreakTime: Number(document.getElementById("shortbreak-input").value),
      longBreakTime: Number(document.getElementById("longbreak-input").value)
    };
    SettingsManager.save(settings);
    this.#popup.classList.remove("show");
    this.applyChangesFromInputs();
  }

  // === 🔧 Utilities ===
  applyChangesFromInputs() {
    const pomodoro = Number(document.getElementById("pomodoro-input").value);
    const shortBreak = Number(document.getElementById("shortbreak-input").value);
    const longBreak = Number(document.getElementById("longbreak-input").value);

    this.#timer.setPomodoroTime(pomodoro);
    this.#timer.setShortBrkTime(shortBreak);
    this.#timer.setLongBrkTime(longBreak);
    this.#timer.updateModeTime();
  }

  restoreSettingsPopupInputs() {
    document.getElementById("pomodoro-input").value = this.#timer.getPomodoroTime();
    document.getElementById("shortbreak-input").value = this.#timer.getShortBrkTime();
    document.getElementById("longbreak-input").value = this.#timer.getLongBrkTime();
  }
}
