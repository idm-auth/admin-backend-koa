import pino from 'pino';
import pinoCaller from 'pino-caller';

let logger: pino.Logger;

export const initialize = async () => {
  const baseLogger = pino({
    level: process.env.LOGGER_LEVEL || 'debug',
    transport: {
      target: 'pino-pretty', // opcional, para logs legíveis no console
      options: {
        colorize: true,
        singleLine: true,
        messageFormat: '[{requestId}] -> {msg}',
      },
    },
  });

  logger = pinoCaller(baseLogger, {
    relativeTo: process.cwd(), // deixa o path relativo à raiz do projeto
  });
  return logger;
};
export const getLogger = async () => {
  if (!logger) await initialize();
  return logger;
};

export const getLoggerNoAsync = () => {
  return logger;
};
