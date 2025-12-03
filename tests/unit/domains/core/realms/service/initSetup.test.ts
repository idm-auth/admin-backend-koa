import * as realmService from '@/domains/core/realms/realm.service';
import { getEnvValue, EnvKey } from '@/plugins/dotenv.plugin';
import { describe, expect, it } from 'vitest';

describe('realm.service.initSetup', () => {
  it('should create or return existing realm with default dbName', async () => {
    const result = await realmService.initSetup();
    const expectedDbName = getEnvValue(EnvKey.MONGODB_CORE_DBNAME);

    expect(result).toHaveProperty('dbName', expectedDbName);
    expect(result).toHaveProperty('name', 'idm-core-realm');
    expect(result).toHaveProperty('description', 'Realm Core');
    expect(result).toHaveProperty('_id');
  });

  it('should be idempotent - multiple calls return same result', async () => {
    const result1 = await realmService.initSetup();
    const result2 = await realmService.initSetup();
    const expectedDbName = getEnvValue(EnvKey.MONGODB_CORE_DBNAME);

    expect(result1._id).toBe(result2._id);
    expect(result1.dbName).toBe(expectedDbName);
    expect(result2.dbName).toBe(expectedDbName);
    expect(result1.name).toBe(result2.name);
  });
});
