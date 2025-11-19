import { NotFoundError } from '@/errors/not-found';
import { describe, expect, it } from 'vitest';
import * as realmService from '@/domains/core/realms/realm.service';
import { getModel } from '@/domains/core/realms/realm.model';
import { v4 as uuidv4 } from 'uuid';

describe('realm.service.findByName', () => {
  it('should throw NotFoundError when realm not found', async () => {
    const uniqueName = `non-existent-${uuidv4()}`;

    await expect(realmService.findByName(uniqueName)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should return realm when found by name', async () => {
    const uniqueName = `test-realm-${uuidv4()}`;

    // Criar um realm para testar
    const createdRealm = await getModel().create({
      name: uniqueName,
      dbName: `test-db-${uuidv4()}`,
      description: 'Test realm',
    });

    // Buscar o realm pelo nome
    const foundRealm = await realmService.findByName(uniqueName);

    expect(foundRealm).toHaveProperty('name', uniqueName);
    expect(foundRealm).toHaveProperty('_id', createdRealm._id);

    // Cleanup
    await getModel().findByIdAndDelete(createdRealm._id);
  });
});
