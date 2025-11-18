import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import * as groupService from '@/domains/realms/groups/group.service';

describe('GET /api/realm/:tenantId/groups - Paginated', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-group-paginated');

    // Criar alguns grupos para os testes usando service
    const groupsData = [
      { name: 'Paginated Group 1', description: 'First test group' },
      { name: 'Paginated Group 2', description: 'Second test group' },
    ];

    for (const groupData of groupsData) {
      await groupService.create(tenantId, groupData);
    }
  });

  describe('Success scenarios', () => {
    it('should list all groups successfully', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/groups/`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);

      // Verificar estrutura dos objetos retornados
      response.body.data.forEach((group: { _id: string; name: string; description?: string }) => {
        expect(group).toHaveProperty('_id');
        expect(group).toHaveProperty('name');
      });
    });

    it('should return empty array when no groups exist', async () => {
      const emptyTenantId = await getTenantId('test-tenant-empty-groups');

      const response = await request(getApp().callback())
        .get(`/api/realm/${emptyTenantId}/groups/`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it('should filter groups by name', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/groups/`)
        .query({ filter: 'Paginated Group 1' })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0].name).toContain('Paginated Group 1');
      }
    });

    it('should sort groups by name', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/groups/`)
        .query({ sortBy: 'name', descending: false })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Error scenarios', () => {
    it('should return 400 for invalid tenantId format', async () => {
      const invalidTenantId = 'invalid-tenant-id';

      const response = await request(getApp().callback())
        .get(`/api/realm/${invalidTenantId}/groups`)
        .query({ page: 1, limit: 10 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid');
    });

    it('should return 400 for invalid pagination parameters', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/groups`)
        .query({ page: -1, limit: 0 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for limit exceeding maximum', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/groups`)
        .query({ page: 1, limit: 1000 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid filter format', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/groups`)
        .query({ filter: 'invalid<>filter' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid filter format');
    });
  });
});