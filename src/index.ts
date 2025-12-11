import 'reflect-metadata';
import {
  container,
  initializeContainer,
} from '@/infrastructure/core/container';
import { App, AppSymbol } from '@/infrastructure/core/app';

void (async () => {
  await initializeContainer();
  const app = container.get<App>(AppSymbol);
  await app.init();
  await app.listen();
})();

const shutdown = async () => {
  const app = container.get<App>(AppSymbol);
  await app.shutdown();
  process.exit(0);
};

process.on('SIGTERM', () => void shutdown());
process.on('SIGINT', () => void shutdown());
