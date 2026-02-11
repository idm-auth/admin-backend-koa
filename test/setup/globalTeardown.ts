import { AppEnv, AppEnvSymbol } from '@/infrastructure/env/appEnv.provider';
import { EnvKey } from '@idm-auth/koa-inversify-framework/common';
import { Container } from 'inversify';
import {
  ContainerSymbol,
  MongoDB,
  MongoDBSymbol,
} from '@idm-auth/koa-inversify-framework/infrastructure';
import { Framework } from '@idm-auth/koa-inversify-framework';
import { EnvSymbol } from '@idm-auth/koa-inversify-framework';
import 'reflect-metadata';

let teardownHappened = false;

/**
 * Teardown global executado UMA vez após TODOS os testes.
 *
 * Por que isso existe:
 * - Limpa banco core global após todos os testes
 * - Evita acúmulo de dados de teste no MongoDB
 * - Mantém ambiente de teste limpo
 *
 * Responsabilidades:
 * - Apaga banco core global (vi-test-db-core-global)
 * - Cada teste já limpou seu próprio banco realm no afterAll
 *
 * Como funciona:
 * - Inicializa apenas Env + MongoDB (não precisa de Koa, Swagger, etc)
 * - Obtém nome do banco do .env.test
 * - Apaga o banco core global
 * - Fecha conexão
 */
export async function teardown() {
  if (teardownHappened) {
    throw new Error('[Global Teardown] teardown called twice');
  }

  try {
    // Inicializa apenas o necessário: container + env + mongodb
    const container = new Container();
    const framework = new Framework();

    container.bind(ContainerSymbol).toConstantValue(container);

    // Configura framework com Env customizado (igual ao globalSetup)
    framework.setContainer(container).setEnv(AppEnv, AppEnvSymbol);

    // Inicializa apenas Env e MongoDB (não precisa de Koa)
    await framework.initCore(container);

    const appEnv = container.get<AppEnv>(AppEnvSymbol);
    await appEnv.init();

    await framework.initDB(container);

    // Obtém MongoDB e nome do banco core
    const mongodb = container.get<MongoDB>(MongoDBSymbol);
    const dbName = appEnv.get(EnvKey.MONGODB_CORE_DBNAME);

    // Apaga banco core global
    const dbConn = mongodb.getDbConn(dbName);
    await dbConn.dropDatabase();

    // Fecha conexão
    await framework.shutdownDB();

    teardownHappened = true;
  } catch (error) {
    // Não lança erro para não falhar os testes
  }
}
