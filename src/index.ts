import { Framework } from 'koa-inversify-framework';
import { bootstrap } from '@/infrastructure/core/bootstrap';

let framework: Framework;

void (async () => {
  ({ framework } = await bootstrap());
  await framework.listen();
})();

const shutdown = async () => {
  await framework.shutdown();
  process.exit(0);
};

process.on('SIGTERM', () => void shutdown());
process.on('SIGINT', () => void shutdown());
