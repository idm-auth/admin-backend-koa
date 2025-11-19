import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import * as roleService from '@/domains/realms/roles/role.service';

describe('GET /api/realm/:tenantId/roles - Paginated', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-role-paginated');

    // Criar alguns roles para os testes usando service
    const rolesData = [
      { name: 'Admin Role', description: 'Administrator role', permissions: ['read', 'write', 'delete'] },
      { name: 'User Role', description: 'Standard user role', permissions: ['read'] },
      { name: 'Editor Role', description: 'Content editor role', permissions: ['read', 'write'] },
    ];

    for (const roleData of rolesData) {
      await roleService.create(tenantId, roleData);
    }
  });

  describe('Success scenarios', () => {
    it('should list all roles successfully', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/roles/`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);

      // Verificar estrutura dos objetos retornados
      response.body.data.forEach(
        (role: { _id: string; name: string; permissions: string[] }) => {
          expect(role).toHaveProperty('_id');
          expect(role).toHaveProperty('name');
          expect(role).toHaveProperty('permissions');
          expect(Array.isArray(role.permissions)).toBe(true);
        }
      );
    });

    it('should return empty array when no roles exist', async () => {
      const emptyTenantId = await getTenantId('test-tenant-empty-roles');

      const response = await request(getApp().callback())
        .get(`/api/realm/${emptyTenantId}/roles/`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it('should filter roles by name', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/roles/`)
        .query({ filter: 'Admin' })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);

      if (response.body.data.length > 0) {
        expect(response.body.data[0].name).toContain('Admin');
      }
    });

    it('should sort roles by name descending', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/roles/`)
        .query({ sortBy: 'name', descending: true })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      
      if (response.body.data.length > 1) {
        const firstRole = response.body.data[0].name;
        const secondRole = response.body.data[1].name;
        expect(firstRole >= secondRole).toBe(true);
      }
    });

    it('should paginate roles correctly', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/roles/`)
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.pagination).toHaveProperty('page', 1);
      expect(response.body.pagination).toHaveProperty('total');
    });

    it('should filter roles by description', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/roles/`)
        .query({ filter: 'editor' })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Error scenarios', () => {
    it('should return 400 for invalid tenantId format', async () => {
      const invalidTenantId = 'invalid-tenant-id';

      const response = await request(getApp().callback())
        .get(`/api/realm/${invalidTenantId}/roles`)
        .query({ page: 1, limit: 10 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid');
    });

    it('should return 400 for invalid pagination parameters', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/roles`)
        .query({ page: -1, limit: 0 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for limit exceeding maximum', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/roles`)
        .query({ page: 1, limit: 1000 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid filter format', async () => {
      const response = await request(getApp().callback())
        .get(`/api/realm/${tenantId}/roles`)
        .query({ filter: 'invalid<>filter' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid filter format');
    });
  });
});