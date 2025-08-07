class SettingsManager {

  static defaultSettings() {
    return {
        pomodoroTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15,
        onAutoBreak: true,
        darkMode: false
    };
  }

  static load() {
    const saved = localStorage.getItem("userSettings");
    return saved ? JSON.parse(saved) : this.defaultSettings();
  }

  static save(settings) {
    localStorage.setItem("userSettings", JSON.stringify(settings));
  }

   static clear() {
    localStorage.removeItem("userSettings");
 }  
}
