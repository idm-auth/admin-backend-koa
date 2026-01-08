import { initCoreModulesPhase1, initCoreModulesPhase2 } from '@/domain/core';
import { initRealmModulesPhase1, initRealmModulesPhase2 } from '@/domain/realm';
import { AppEnv, AppEnvSymbol } from '@/infrastructure/env/appEnv.provider';
import {
  RealmTenantResolver,
  RealmTenantResolverSymbol,
} from '@/infrastructure/tenant/realmTenantResolver.provider';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Container } from 'inversify';
import { Framework } from 'koa-inversify-framework';
import {
  ContainerSymbol,
  KoaServer,
  KoaServerSymbol,
} from 'koa-inversify-framework/infrastructure';
import type Koa from 'koa';

export async function bootstrap(): Promise<{
  framework: Framework;
  container: Container;
  app: Koa;
}> {
  const container = new Container();
  const registry = new OpenAPIRegistry();
  const framework = new Framework();

  container.bind(ContainerSymbol).toConstantValue(container);

  framework
    .setContainer(container)
    .setRegistry(registry)
    .setTenantResolver(RealmTenantResolver, RealmTenantResolverSymbol)
    .setEnv(AppEnv, AppEnvSymbol);

  await framework.init();

  const appEnv = container.get<AppEnv>(AppEnvSymbol);
  await appEnv.init();

  await initCoreModulesPhase1(container);
  await initRealmModulesPhase1(container);
  await initRealmModulesPhase2(container);
  await initCoreModulesPhase2(container);

  const koaServer = container.get<KoaServer>(KoaServerSymbol);
  const app = koaServer.getApp();
  return { framework, container, app };
}
