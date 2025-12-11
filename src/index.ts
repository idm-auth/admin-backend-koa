import 'reflect-metadata';
import { initializeContainer } from '@/infrastructure/core/container';
import { getContainer } from '@/infrastructure/core/container.instance';
import { App, AppSymbol } from '@/infrastructure/core/app';

void (async () => {
  await initializeContainer();
  const container = getContainer();
  const app = container.get<App>(AppSymbol);
  await app.init();
  await app.listen();
})();

const shutdown = async () => {
  const container = getContainer();
  const app = container.get<App>(AppSymbol);
  await app.shutdown();
  process.exit(0);
};

process.on('SIGTERM', () => void shutdown());
process.on('SIGINT', () => void shutdown());
