import { describe, expect, it, vi } from 'vitest';
import * as realmService from '@/domains/core/realms/realm.service';
import { getModel } from '@/domains/core/realms/realm.model';
import * as realmsModel from '@/domains/core/realms/realm.model';
import { Realm } from '@/domains/core/realms/realm.model';
import { v4 as uuidv4 } from 'uuid';

describe('realm.service.create', () => {
  it('should create realm successfully', async () => {
    const uniqueName = `test-realm-success-${uuidv4()}`;
    const uniqueDbName = `test-db-success-${uuidv4()}`;

    const result: Realm = await realmService.create({
      name: uniqueName,
      dbName: uniqueDbName,
      description: 'Test realm success',
    });

    expect(result).toHaveProperty('_id');
    expect(result.name).toBe(uniqueName);
    expect(result.dbName).toBe(uniqueDbName);

    await getModel().findByIdAndDelete(result._id);
  });

  it('should throw ConflictError for duplicate name', async () => {
    const uniqueName = `test-realm-duplicate-${uuidv4()}`;

    // Garantir que os índices estão criados
    await getModel().createIndexes();

    const first: Realm = await realmService.create({
      name: uniqueName,
      dbName: `test-db-${uuidv4()}`,
      description: 'First realm',
    });

    await expect(
      realmService.create({
        name: uniqueName,
        dbName: `test-db-${uuidv4()}`,
        description: 'Second realm',
      })
    ).rejects.toThrow('Resource already exists');

    await getModel().findByIdAndDelete(first._id);
  });

  it('should rethrow error for duplicate publicUUID', async () => {
    const publicUUID = uuidv4();

    await getModel().createIndexes();

    const first: Realm = await realmService.create({
      name: `test-realm-${uuidv4()}`,
      dbName: `test-db-${uuidv4()}`,
      publicUUID,
      description: 'First realm',
    });

    await expect(
      realmService.create({
        name: `test-realm-${uuidv4()}`,
        dbName: `test-db-${uuidv4()}`,
        publicUUID,
        description: 'Second realm',
      })
    ).rejects.toThrow();

    await getModel().findByIdAndDelete(first._id);
  });

  it('should rethrow non-MongoDB errors', async () => {
    const getModelSpy = vi.spyOn(realmsModel, 'getModel');
    getModelSpy.mockReturnValue({
      create: vi.fn().mockRejectedValue('string error'),
    } as unknown as ReturnType<typeof realmsModel.getModel>);

    await expect(
      realmService.create({
        name: 'test',
        dbName: 'test',
      })
    ).rejects.toBe('string error');

    vi.restoreAllMocks();
  });
});
