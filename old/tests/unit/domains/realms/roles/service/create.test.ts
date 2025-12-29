import { describe, expect, it } from 'vitest';
import * as roleService from '@/domains/realms/roles/role.service';
import { RoleDocument } from '@/domains/realms/roles/role.model';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('role.service.create', () => {
  it('should create role successfully', async () => {
    const tenantId = await getTenantId('vi-test-db-role-service-create');
    const roleData = {
      name: `test-role-${uuidv4()}`,
      description: 'Test role',
      permissions: ['read', 'write'],
    };

    const role: RoleDocument = await roleService.create(tenantId, roleData);

    expect(role).toHaveProperty('_id');
    expect(role.name).toBe(roleData.name);
    expect(role.description).toBe(roleData.description);
    expect(role.permissions).toEqual(roleData.permissions);
    expect(role).toHaveProperty('createdAt');
    expect(role).toHaveProperty('updatedAt');
  });

  it('should create role with minimal data', async () => {
    const tenantId = await getTenantId(
      'vi-test-db-role-service-create-minimal'
    );
    const roleData = {
      name: `minimal-role-${uuidv4()}`,
    };

    const role: RoleDocument = await roleService.create(tenantId, roleData);

    expect(role).toHaveProperty('_id');
    expect(role.name).toBe(roleData.name);
    expect(role.description).toBeUndefined();
    expect(role.permissions).toEqual([]);
  });
});
