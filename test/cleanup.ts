import { AppEnv, AppEnvSymbol } from '@/infrastructure/env/appEnv.provider';
import { Container } from 'inversify';
import {
  ContainerSymbol,
  MongoDB,
  MongoDBSymbol,
} from '@idm-auth/koa-inversify-framework/infrastructure';
import { Framework } from '@idm-auth/koa-inversify-framework';
import 'reflect-metadata';

/**
 * Script para limpar bancos de teste órfãos.
 *
 * Uso: npm run test:cleanup
 */
async function cleanup() {
  try {
    const container = new Container();
    const framework = new Framework();

    container.bind(ContainerSymbol).toConstantValue(container);

    framework.setContainer(container).setEnv(AppEnv, AppEnvSymbol);

    await framework.initCore(container);

    const appEnv = container.get<AppEnv>(AppEnvSymbol);
    await appEnv.init();

    await framework.initDB(container);

    const mongodb = container.get<MongoDB>(MongoDBSymbol);
    const conn = mongodb.getConn();
    const adminDb = conn.db?.admin();
    if (!adminDb) {
      throw new Error('No admin db');
    }
    const dbList = await adminDb.listDatabases();

    const testDbs = dbList.databases
      .map((d) => d.name)
      .filter((n) => n.startsWith('vi-test-db'));

    console.log(`🗑️  Found ${testDbs.length} test databases to clean:`);
    testDbs.forEach((db) => console.log(`   - ${db}`));

    for (const dbName of testDbs) {
      const db = conn.useDb(dbName, { useCache: false });
      await db.dropDatabase();
      console.log(`✅ Dropped: ${dbName}`);
    }

    console.log(`\n✅ Cleanup completed: ${testDbs.length} databases dropped`);

    await framework.shutdownDB();
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

cleanup();
