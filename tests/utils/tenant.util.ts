import realmService from '@/services/latest/realm.service';

/**
 * Obtém ou cria um tenant ID único para testes
 * @param name Nome do tenant (ex: 'test-tenant-core')
 * @returns publicUUID do tenant
 */
export async function getTenantId(name: string): Promise<string> {
  let realm = await realmService.findByName({ name: name });

  if (!realm) {
    realm = await realmService.create({ data: { name, dbName: name } });
  }

  return realm.publicUUID;
}
