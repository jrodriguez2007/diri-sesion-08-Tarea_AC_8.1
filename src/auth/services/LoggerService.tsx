type LogLevel = "debug" | "info" | "warn" | "error";

class LoggerService {

    private levels: LogLevel[]; // Define available log levels
    private currentLevel: LogLevel; // Track the current log level

    constructor() {
        this.levels = ["debug", "info", "warn", "error"];
        this.currentLevel = "debug";
    }

    setLevel(level: LogLevel): void {
        if (this.levels.includes(level)) {
            this.currentLevel = level;
        } else {
            console.error(`Nivel de log no válido: ${level}`);
        }
    }

    private log(level: LogLevel, message: string): void {
        const levelIndex = this.levels.indexOf(level);
        const currentLevelIndex = this.levels.indexOf(this.currentLevel);
        if (levelIndex >= currentLevelIndex) {
        const timestamp = new Date().toISOString();
        console[level](`[${level.toUpperCase()}] ${timestamp}: ${message}`);
        }
    }

    debug(message: string): void {
            this.log("debug", message);
    }
    info(message: string): void {
        this.log("info", message);
    }
    warn(message: string): void {
        this.log("warn", message);
    }
    error(message: string): void {
        this.log("error", message);
    }
}

const loggerService = new LoggerService();
export default loggerService;