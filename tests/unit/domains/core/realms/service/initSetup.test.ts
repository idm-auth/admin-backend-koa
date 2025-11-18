import * as realmService from '@/domains/core/realms/realm.service';
import { describe, expect, it } from 'vitest';

describe('realm.service.initSetup', () => {
  it('should create or return existing realm with default dbName', async () => {
    // Usar o default 'idm-core-db'
    const result = await realmService.initSetup();

    expect(result).toHaveProperty('dbName', 'idm-core-db');
    expect(result).toHaveProperty('name', 'idm-core-realm');
    expect(result).toHaveProperty('description', 'Realm Core');
    expect(result).toHaveProperty('_id');
  });

  it('should be idempotent - multiple calls return same result', async () => {
    const result1 = await realmService.initSetup();
    const result2 = await realmService.initSetup();

    expect(result1._id).toBe(result2._id);
    expect(result1.dbName).toBe(result2.dbName);
    expect(result1.name).toBe(result2.name);
  });
});
