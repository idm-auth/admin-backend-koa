import { Framework } from 'koa-inversify-framework';
import { ContainerSymbol } from 'koa-inversify-framework/infrastructure';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Container } from 'inversify';
import 'reflect-metadata';
import { RealmTenantResolver } from '@/infrastructure/tenant/realmTenantResolver.provider';
import { AppEnv } from '@/infrastructure/env/appEnv.provider';
import { initCoreModulesPhase1, initCoreModulesPhase2 } from '@/domain/core';
import { initRealmModules } from '@/domain/realm';

const container = new Container();
const registry = new OpenAPIRegistry();
const framework = new Framework();

void (async () => {
  container.bind(ContainerSymbol).toConstantValue(container);

  framework
    .setContainer(container)
    .setRegistry(registry)
    .setTenantResolver(RealmTenantResolver)
    .setEnv(AppEnv);

  await framework.init();

  await initCoreModulesPhase1(container);
  await initRealmModules(container);
  await initCoreModulesPhase2(container);

  await framework.listen();
})();

const shutdown = async () => {
  await framework.shutdown();
  process.exit(0);
};

process.on('SIGTERM', () => void shutdown());
process.on('SIGINT', () => void shutdown());
