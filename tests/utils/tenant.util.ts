import * as realmService from '@/domains/core/realms/realm.service';
import { NotFoundError } from '@/errors/not-found';

/**
 * Obtém ou cria um tenant ID único para testes
 * @param name Nome do tenant (ex: 'test-tenant-core')
 * @returns publicUUID do tenant
 */
export async function getTenantId(name: string): Promise<string> {
  try {
    const realm = await realmService.findByName(name);
    return realm.publicUUID;
  } catch (error) {
    if (error instanceof NotFoundError) {
      const realm = await realmService.create({
        name,
        dbName: name,
      });
      return realm.publicUUID;
    }
    throw error;
  }
}
