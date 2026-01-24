type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  minLevel: LogLevel;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const config: LoggerConfig = {
  enabled: import.meta.env.DEV,
  minLevel: 'debug',
};

function shouldLog(level: LogLevel): boolean {
  if (!config.enabled) return false;
  return LOG_LEVELS[level] >= LOG_LEVELS[config.minLevel];
}

function formatMessage(prefix: string, message: string): string {
  const timestamp = new Date().toISOString().substring(11, 23);
  return `[${timestamp}] [${prefix}] ${message}`;
}

export const logger = {
  debug: (prefix: string, message: string, ...args: unknown[]) => {
    if (shouldLog('debug')) {
      console.log(formatMessage(prefix, message), ...args);
    }
  },

  info: (prefix: string, message: string, ...args: unknown[]) => {
    if (shouldLog('info')) {
      console.info(formatMessage(prefix, message), ...args);
    }
  },

  warn: (prefix: string, message: string, ...args: unknown[]) => {
    if (shouldLog('warn')) {
      console.warn(formatMessage(prefix, message), ...args);
    }
  },

  error: (prefix: string, message: string, ...args: unknown[]) => {
    if (shouldLog('error')) {
      console.error(formatMessage(prefix, message), ...args);
    }
  },

  setEnabled: (enabled: boolean) => {
    config.enabled = enabled;
  },

  setMinLevel: (level: LogLevel) => {
    config.minLevel = level;
  },
};
