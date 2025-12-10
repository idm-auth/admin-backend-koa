import pino from 'pino';
import pinoCaller from 'pino-caller';
import { EnvKey, getEnvValue } from './dotenv.plugin';

let logger: pino.Logger;

export const initPino = async () => {
  if (logger) return logger;

  const baseLogger = pino({
    level: getEnvValue(EnvKey.LOGGER_LEVEL),
    transport: {
      target: 'pino-pretty',
      options: {
        destination: 1,
        colorize: true,
        singleLine: true,
        messageFormat: '[{requestId}] -> {msg}',
        sync: true,
      },
    },
  });

  logger = pinoCaller(baseLogger, {
    relativeTo: process.cwd(),
  });
  return logger;
};

export const getLogger = async () => {
  if (!logger) await initPino();
  return logger;
};

// amazonq-ignore-next-line
export const getLoggerNoAsync = () => {
  return logger;
};

export const flushLogs = async (): Promise<unknown> => {
  if (!logger) return;
  logger.flush();
};
