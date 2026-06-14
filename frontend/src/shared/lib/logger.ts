type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };

  const prefix = `[BCS:${level.toUpperCase()}]`;

  if (level === "error") {
    console.error(prefix, entry.message, entry.context ?? "");
  } else if (level === "warn") {
    console.warn(prefix, entry.message, entry.context ?? "");
  } else {
    if (process.env.NODE_ENV !== "production") {
      console.info(prefix, entry.message, entry.context ?? "");
    }
  }
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) =>
    log("info", message, context),
  warn: (message: string, context?: Record<string, unknown>) =>
    log("warn", message, context),
  error: (message: string, context?: Record<string, unknown>) =>
    log("error", message, context),
};
