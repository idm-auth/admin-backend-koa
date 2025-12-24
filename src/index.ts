import { Framework } from 'koa-inversify-framework';
import { ContainerSymbol } from 'koa-inversify-framework';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Container } from 'inversify';
import 'reflect-metadata';
import { RealmTenantResolver } from '@/infrastructure/tenant/realmTenantResolver.provider';
import { RealmModule } from '@/domain/core/realm/realm.module';
import { AccountModule } from '@/domain/realm/account/account.module';

const container = new Container();
const registry = new OpenAPIRegistry();
const framework = new Framework();

void (async () => {
  container.bind(ContainerSymbol).toConstantValue(container);

  framework
    .setContainer(container)
    .setRegistry(registry)
    .setTenantResolver(RealmTenantResolver);

  await framework.init();

  new RealmModule(container);
  new AccountModule(container);

  await framework.listen();
})();

const shutdown = async () => {
  await framework.shutdown();
  process.exit(0);
};

process.on('SIGTERM', () => void shutdown());
process.on('SIGINT', () => void shutdown());
