import { koa } from '@/plugins/koaServer.plugin';
import { pinoLogger } from '@/plugins/pino.plugin';

(async () => {
  await pinoLogger.initialize();
  await koa.initialize();
})();
