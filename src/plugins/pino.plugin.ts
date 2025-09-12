import pino from 'pino';

export let logger: pino.Logger | null = null;

const initialize = async () => {
  logger = pino({
    level: 'info',
    transport: {
      target: 'pino-pretty', // opcional, para logs legíveis no console
      options: {
        colorize: true,
        singleLine: true,
        messageFormat: '[{requestId}]: {msg}',
      },
    },
  });
  return logger;
};

export const pinoLogger = {
  logger,
  initialize,
};
