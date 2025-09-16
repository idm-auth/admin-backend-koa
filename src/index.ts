import { koa } from '@/plugins/koaServer.plugin';
import { pinoLogger } from '@/plugins/pino.plugin';
import { initMainConnection } from './plugins/mongo.plugin';
import { dotenv } from './plugins/dotenv.plugin';

(async () => {
  await dotenv.init();
  await pinoLogger.initialize();
  await initMainConnection();
  await koa.initialize();
})();
