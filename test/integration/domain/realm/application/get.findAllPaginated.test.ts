import { afterAll, beforeAll, describe, it } from 'vitest';
import { createTestRealm, deleteTestRealm } from '@test/utils/realm.util';
import { DocId } from 'koa-inversify-framework/common';

/**
 * Testes de integração para listagem paginada de Applications.
 *
 * Estratégia:
 * - Usa banco core global (vi-test-db-core-global)
 * - Cria realm de teste usando RealmService diretamente
 * - Remove realm após testes
 * - Não usa setTestDatabase (queremos usar banco core)
 *
 * Autenticação:
 * - Endpoint requer @Authenticated({ required: true })
 * - TODO: Implementar getAuthToken e descomentar testes
 */
describe('GET /api/realm/:tenantId/application', () => {
  let tenantId: string;
  let realmId: DocId;

  beforeAll(async () => {
    // Cria realm de teste usando service (não HTTP)
    const realm = await createTestRealm(
      `vi-test-db-realm-application-get-findAllPaginated`,
      `vi-test-db-realm-application-get-findAllPaginated`
    );

    realmId = realm._id.toString();
    tenantId = realm.publicUUID;
  });

  afterAll(async () => {
    // Remove realm de teste
    await deleteTestRealm(realmId);
  });

  // TODO: Descomentar quando implementar getAuthToken
  it.todo('should list applications with pagination');
  it.todo('should return empty list when no applications exist');

  // it('should list applications with pagination', async () => {
  //   const authToken = await getAuthToken();
  //   const response = await request(getApp().callback())
  //     .get(`/api/realm/${tenantId}/application`)
  //     .set('Authorization', `Bearer ${authToken}`)
  //     .expect(200);
  //
  //   expect(response.body).toHaveProperty('items');
  //   expect(response.body).toHaveProperty('total');
  //   expect(response.body).toHaveProperty('page');
  //   expect(response.body).toHaveProperty('limit');
  //   expect(Array.isArray(response.body.items)).toBe(true);
  // });
  //
  // it('should return empty list when no applications exist', async () => {
  //   const authToken = await getAuthToken();
  //   const response = await request(getApp().callback())
  //     .get(`/api/realm/${tenantId}/application`)
  //     .set('Authorization', `Bearer ${authToken}`)
  //     .expect(200);
  //
  //   expect(response.body.items).toHaveLength(0);
  //   expect(response.body.total).toBe(0);
  // });
});
