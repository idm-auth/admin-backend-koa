import * as koa from '@/plugins/koaServer.plugin';
import * as pino from '@/plugins/pino.plugin';
import * as mongo from './plugins/mongo.plugin';
import { dotenv } from './plugins/dotenv.plugin';

(async () => {
  await dotenv.init();
  await pino.initialize();
  await mongo.initMainConnection();
  await koa.initialize();
  await koa.listen();
})();
