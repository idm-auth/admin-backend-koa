import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { getApp } from '@test/setup/base.setup';
import { createTestRealm, deleteTestRealm } from '@test/utils/realm.util';

/**
 * Testes de integração para listagem paginada de Accounts.
 *
 * Estratégia:
 * - Usa banco core global (vi-test-db-core-global)
 * - Cria realm de teste usando RealmService diretamente
 * - Remove realm após testes
 * - Não usa setTestDatabase (queremos usar banco core)
 *
 * Autenticação:
 * - Endpoint NÃO requer autenticação (sem @Authenticated)
 */
describe('GET /api/realm/:tenantId/account', () => {
  let tenantId: string;
  let realmId: string;

  beforeAll(async () => {
    const realm = await createTestRealm(
      `test-realm-${Date.now()}`,
      `vi-test-db-realm-account-${Date.now()}`
    );

    realmId = realm._id.toString();
    tenantId = realm.publicUUID;
  });

  afterAll(async () => {
    await deleteTestRealm(realmId);
  });

  it('should list accounts with pagination', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account`)
      .expect(200);

    // Valida estrutura de resposta paginada
    expect(response.body).toHaveProperty('items');
    expect(response.body).toHaveProperty('pagination');
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.pagination).toHaveProperty('total');
    expect(response.body.pagination).toHaveProperty('page');
    expect(response.body.pagination).toHaveProperty('limit');
  });

  it('should return empty list when no accounts exist', async () => {
    const response = await request(getApp().callback())
      .get(`/api/realm/${tenantId}/account`)
      .expect(200);

    expect(response.body.items).toHaveLength(0);
    expect(response.body.pagination.total).toBe(0);
  });
});
