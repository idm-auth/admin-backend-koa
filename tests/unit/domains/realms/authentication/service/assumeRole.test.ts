import * as authService from '@/domains/realms/authentication/authentication.service';
import * as roleService from '@/domains/realms/roles/role.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import { beforeAll, describe, expect, it } from 'vitest';

describe('authentication.service.assumeRole', () => {
  let tenantId: string;
  let roleId: string;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-auth-assume-role');

    const role = await roleService.create(tenantId, {
      name: `test-role-${uuidv4()}`,
      description: 'Test role',
    });
    roleId = role._id;
  });

  it('should assume role successfully', async () => {
    const sourceAccountId = uuidv4();

    const result = await authService.assumeRole(tenantId, sourceAccountId, {
      targetRealmId: tenantId,
      assumedRoleId: roleId,
    });

    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('expiresIn');
    expect(typeof result.token).toBe('string');
    expect(typeof result.expiresIn).toBe('number');
  });
});
