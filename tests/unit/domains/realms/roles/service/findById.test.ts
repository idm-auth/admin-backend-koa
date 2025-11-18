import { describe, expect, it } from 'vitest';
import * as roleService from '@/domains/realms/roles/role.service';
import { NotFoundError } from '@/errors/not-found';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('role.service.findById', () => {
  it('should find role by id successfully', async () => {
    const tenantId = await getTenantId('test-role-service-findById');
    const roleData = {
      name: `find-role-${uuidv4()}`,
      description: 'Role to find',
    };

    const createdRole = await roleService.create(tenantId, roleData);
    const foundRole = await roleService.findById(tenantId, createdRole._id);

    expect(foundRole._id).toBe(createdRole._id);
    expect(foundRole.name).toBe(roleData.name);
    expect(foundRole.description).toBe(roleData.description);
  });

  it('should throw NotFoundError for non-existent role', async () => {
    const tenantId = await getTenantId('test-role-service-findById-notfound');
    const nonExistentId = uuidv4();

    await expect(roleService.findById(tenantId, nonExistentId)).rejects.toThrow(
      NotFoundError
    );
  });
});
