import { NotFoundError } from '@/errors/not-found';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import * as realmService from '@/domains/core/realms/realm.service';
import { getModel } from '@/domains/core/realms/realm.model';
import { EnvKey, setLocalMemValue } from '@/plugins/dotenv.plugin';
import { v4 as uuidv4 } from 'uuid';

describe('realm.service.getRealmCore', () => {
  const coreRealmName = `core-realm-${uuidv4()}`;
  let createdRealmId: string;

  beforeAll(async () => {
    setLocalMemValue(EnvKey.CORE_REALM_NAME, coreRealmName);

    const createdRealm = await getModel().create({
      name: coreRealmName,
      dbName: `vi-test-db-core-${uuidv4()}`,
      description: 'Test core realm',
    });
    createdRealmId = createdRealm._id.toString();
  });

  afterAll(async () => {
    await getModel().findByIdAndDelete(createdRealmId);
  });

  it('should return core realm when found', async () => {
    const coreRealm = await realmService.getRealmCore();

    expect(coreRealm).toHaveProperty('name', coreRealmName);
    expect(coreRealm).toHaveProperty('_id', createdRealmId);
  });

  it('should throw NotFoundError when core realm not found', async () => {
    const nonExistentName = `non-existent-${uuidv4()}`;
    setLocalMemValue(EnvKey.CORE_REALM_NAME, nonExistentName);

    await expect(realmService.getRealmCore()).rejects.toThrow(NotFoundError);

    // Restore
    setLocalMemValue(EnvKey.CORE_REALM_NAME, coreRealmName);
  });
});
