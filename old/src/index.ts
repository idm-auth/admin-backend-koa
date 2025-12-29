import { initDotenv } from './plugins/dotenv.plugin';
import { initKoa, listenKoa } from './plugins/koaServer.plugin';
import { closeMainConnection, initMongo } from './plugins/mongo.plugin';
import { flushLogs, getLogger, initPino } from './plugins/pino.plugin';
import { initTelemetry, shutdownTelemetry } from './plugins/telemetry.plugin';

// amazonq-ignore-next-line
(async () => {
  await initDotenv();
  await initPino();
  await initMongo();
  await initTelemetry();
  await initKoa();
  await listenKoa();
})();

const shutdown = async (signal: string) => {
  const logger = await getLogger();
  logger.info({ signal }, 'Shutdown signal received');
  await shutdownTelemetry();
  await closeMainConnection();
  logger.info('Shutdown completed');
  await flushLogs();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
