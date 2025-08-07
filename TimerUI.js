//TimerUI.js
class TimerUI {
  #timer;
  #popup;
  

  constructor(timer) {
    this.#timer = timer;
    this.#popup = document.getElementById("popup");
    this.init();
  }

  init() {
    this.#timer.setOnModeChange(() => {
        this.updateUI(); // already calls updateModeButtons + applyThemeClass
    });
    this.bindButtons();
    this.bindPopup();
    this.bindModeSwitching();
    this.loadSettings();
    this.restoreSettingsPopupInputs();
    setTimeout(() => {
    document.body.style.transition = 'background-color 0.6s ease';
    }, 100); // wait for first paint before animating
  }
  
  // Theme
  applyThemeClass(mode) {
  document.body.classList.remove("pomodoro", "short-break", "long-break");

  switch (mode) {
    case Timer.TimerMode.POMODORO:
      document.body.classList.add("pomodoro");
      break;
    case Timer.TimerMode.SHORT_BREAK:
      document.body.classList.add("short-break");
      break;
    case Timer.TimerMode.LONG_BREAK:
      document.body.classList.add("long-break");
      break;
  }
}

 



  // === 🎛️ Buttons ===
  bindButtons() {
    document.getElementById("start-pause-btn").addEventListener("click", () => this.startAndPause());
    document.getElementById("reset-btn").addEventListener("click", () => this.#timer.reset());
    document.getElementById("save-btn").addEventListener("click", () => this.saveUserSettings());
    document.getElementById("default-btn").addEventListener("click", ()=> this.loadDefaultSettings());
    document.getElementById("autobreak-check").addEventListener("change", ()=> this.changeAutoBreak());
    document.getElementById("lightDarkMode-btn").addEventListener("click", ()=> this.toggleDarkMode(!document.body.classList.contains("dark")));
  }

   toggleDarkMode(on) {
    document.body.classList.toggle("dark", on);
    const icon = document.getElementById('lightDarkMode-btn');

    if (on) {
      icon.classList.replace('fa-sun',  'fa-moon');
      icon.style.color = "#4137ccff";
  } else {
      icon.classList.replace('fa-moon', 'fa-sun');
      icon.style.color = "rgb(250, 15, 15)";
    }
  }

  // ==== Start/Pause ===
  startAndPause() {
    if (this.#timer.isRunning()) {
        this.#timer.pause();
        document.getElementById("start-pause-btn").innerText = "Start";
    } else {
        this.#timer.start();
        document.getElementById("start-pause-btn").innerText = "Pause";
    }
  };
  
//  === Auto Break ===
 changeAutoBreak(){
    this.#timer.setAutoBreak(document.getElementById("autobreak-check").checked);
 }

  // === ⏱️ Mode Switching ===
  bindModeSwitching() {
    const pomodoro = document.getElementById("pomodoro-btn");
    const shortbreak = document.getElementById("shortbreak-btn");
    const longbreak = document.getElementById("longbreak-btn");

    pomodoro.addEventListener("click", () => {
      this.#timer.switchToPomodoro();
      this.updateUI();
      document.getElementById("start-pause-btn").innerText = "Start";
    });

    shortbreak.addEventListener("click", () => {
      this.#timer.switchToShortBrk();
      this.updateUI();
      document.getElementById("start-pause-btn").innerText = "Start";
    });

    longbreak.addEventListener("click", () => {
      this.#timer.switchToLongBrk();
      this.updateUI();
      document.getElementById("start-pause-btn").innerText = "Start";
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
    
    this.#timer.setPomodoroTime(saved.pomodoroTime);
    this.#timer.setShortBrkTime(saved.shortBreakTime);
    this.#timer.setLongBrkTime(saved.longBreakTime);
    this.#timer.setAutoBreak(saved.onAutoBreak);

    this.toggleDarkMode(saved.darkMode);

    this.#timer.reset();       // ✅ Set timer to correct mode with new time
    this.updateUI();           // ✅ Sync the UI with new mode
  }

  loadDefaultSettings(){
    SettingsManager.clear();
    this.loadSettings();
    this.restoreSettingsPopupInputs();
  }

  saveUserSettings() {
    const settings = {
      pomodoroTime: Number(document.getElementById("pomodoro-input").value),
      shortBreakTime: Number(document.getElementById("shortbreak-input").value),
      longBreakTime: Number(document.getElementById("longbreak-input").value),
      onAutoBreak: document.getElementById("autobreak-check").checked,
      darkMode:  document.body.classList.contains("dark")
    };
    SettingsManager.save(settings);
    this.#popup.classList.remove("show");
    this.applyChangesFromInputs();
    this.#timer.reset();       // ✅ Set timer to correct mode with new time
    this.updateUI();           // ✅ Sync the UI with new mode
    document.getElementById("start-pause-btn").innerText = "Start";
  }

  // === 🔧 Utilities ===
  applyChangesFromInputs() {
    const pomodoro = Number(document.getElementById("pomodoro-input").value);
    const shortBreak = Number(document.getElementById("shortbreak-input").value);
    const longBreak = Number(document.getElementById("longbreak-input").value);
    const onAutoBreak = document.getElementById("autobreak-check").checked;

    this.#timer.setPomodoroTime(pomodoro);
    this.#timer.setShortBrkTime(shortBreak);
    this.#timer.setLongBrkTime(longBreak);
    this.#timer.setAutoBreak(onAutoBreak);

  }

  restoreSettingsPopupInputs() {
    const saved = SettingsManager.load();
    document.getElementById("pomodoro-input").value = this.#timer.getPomodoroTime();
    document.getElementById("shortbreak-input").value = this.#timer.getShortBrkTime();
    document.getElementById("longbreak-input").value = this.#timer.getLongBrkTime();
    document.getElementById("autobreak-check").checked = saved.onAutoBreak;
  }

  updateUI() {
    this.updateModeButtons();
    this.applyThemeClass(this.#timer.getTimerMode());
  }
}
