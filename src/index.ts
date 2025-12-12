import { Framework } from 'koa-inversify-framework';
import 'reflect-metadata';
import { getContainer } from './infrastructure/container.instance';
import { AccountModule } from '@/domain/realm/account/account.module';

const container = getContainer();
const framework = new Framework();

void (async () => {
  await framework.init(container);

  const accountModule = new AccountModule();
  accountModule.bind(container);

  const controllerSymbols = [
    accountModule.getControllerSymbol(),
  ];

  framework.register(controllerSymbols, container);
  await framework.listen();
})();

const shutdown = async () => {
  await framework.shutdown();
  process.exit(0);
};

process.on('SIGTERM', () => void shutdown());
process.on('SIGINT', () => void shutdown());
