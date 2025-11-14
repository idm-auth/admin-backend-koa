import { describe, expect, it } from 'vitest';
import * as realmService from '@/domains/core/realms/realm.service';
import { getModel } from '@/domains/core/realms/realms.model';

describe('realm.service.initSetup', () => {
  it('should throw error when MONGODB_CORE_DBNAME is not set', async () => {
    const originalEnv = process.env.MONGODB_CORE_DBNAME;
    delete process.env.MONGODB_CORE_DBNAME;

    await expect(realmService.initSetup()).rejects.toThrow(
      'MONGODB_CORE_DBNAME is not set'
    );

    process.env.MONGODB_CORE_DBNAME = originalEnv;
  });

  it('should create new realm when not found', async () => {
    process.env.MONGODB_CORE_DBNAME = 'test-unique-db-name';

    // Garantir que não existe um realm com esse dbName
    const existingRealm = await getModel().findOne({
      dbName: 'test-unique-db-name',
    });
    if (existingRealm) {
      await getModel().findByIdAndDelete(existingRealm._id);
    }

    const result = await realmService.initSetup();

    expect(result).toHaveProperty('dbName', 'test-unique-db-name');
    expect(result).toHaveProperty('name', 'idm-core-realm');
    expect(result).toHaveProperty('description', 'Realm Core');

    // Cleanup
    await getModel().findByIdAndDelete(result._id);
  });

  it('should return existing realm when found', async () => {
    process.env.MONGODB_CORE_DBNAME = 'test-existing-db-name';

    // Criar um realm primeiro
    const createdRealm = await getModel().create({
      dbName: 'test-existing-db-name',
      name: 'idm-core-realm',
      description: 'Realm Core',
    });

    const result = await realmService.initSetup();

    expect(result).toHaveProperty('_id', createdRealm._id);
    expect(result).toHaveProperty('dbName', 'test-existing-db-name');

    // Cleanup
    await getModel().findByIdAndDelete(createdRealm._id);
  });

  it('should handle existing realm scenario for coverage', async () => {
    process.env.MONGODB_CORE_DBNAME = 'test-coverage-db-name';

    // Criar realm primeiro para garantir que existe
    const existingRealm = await getModel().create({
      dbName: 'test-coverage-db-name',
      name: 'idm-core-realm',
      description: 'Realm Core',
    });

    // Chamar initSetup que deve encontrar o realm existente
    const result = await realmService.initSetup();

    // Verificar que retornou o realm existente (linha 251-252)
    expect(result._id).toBe(existingRealm._id);
    expect(result.dbName).toBe('test-coverage-db-name');

    // Cleanup
    await getModel().findByIdAndDelete(existingRealm._id);
  });
});
