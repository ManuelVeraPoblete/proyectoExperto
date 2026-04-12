type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = import.meta.env.DEV;

const log = (level: LogLevel, ...args: unknown[]): void => {
  // Suprimir debug en producción
  if (!isDev && level === 'debug') return;
  // eslint-disable-next-line no-console
  console[level](...args);
};

export const logger = {
  debug: (...args: unknown[]): void => log('debug', ...args),
  info:  (...args: unknown[]): void => log('info',  ...args),
  warn:  (...args: unknown[]): void => log('warn',  ...args),
  error: (...args: unknown[]): void => log('error', ...args),
};
