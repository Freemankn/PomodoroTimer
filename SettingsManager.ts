export interface Settings {
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  onAutoBreak: boolean;
  darkMode: boolean;
}

export class SettingsManager {
  static defaultSettings(): Settings {
    return {
      pomodoroTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
      onAutoBreak: true,
      darkMode: false,
    };
  }

  static load(): Settings {
    const saved = localStorage.getItem('userSettings');
    return saved ? (JSON.parse(saved) as Settings) : this.defaultSettings();
  }

  static save(settings: Settings): void {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }

  static clear(): void {
    localStorage.removeItem('userSettings');
  }
}
