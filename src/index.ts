import { initDotenv } from './plugins/dotenv.plugin';
import { initPino, getLogger } from './plugins/pino.plugin';
import { initMongo, closeMainConnection } from './plugins/mongo.plugin';
import { initTelemetry, shutdownTelemetry } from './plugins/telemetry.plugin';
import { initKoa, listenKoa } from './plugins/koaServer.plugin';

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
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
