import { initDotenv } from './plugins/dotenv.plugin';
import { initPino } from './plugins/pino.plugin';
import { initMongo } from './plugins/mongo.plugin';
import { initTelemetry } from './plugins/telemetry.plugin';
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
